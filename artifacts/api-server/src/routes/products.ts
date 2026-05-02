import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, usersTable, reviewsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, sql, desc, asc } from "drizzle-orm";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
} from "@workspace/api-zod";

const router = Router();

const MOCK_CREATOR_ID = 1;

function formatProduct(p: typeof productsTable.$inferSelect, creatorName: string, rating: number, reviewCount: number) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: Number(p.price),
    imageUrl: p.imageUrl ?? undefined,
    category: p.category,
    creatorName,
    creatorId: p.creatorId,
    rating,
    reviewCount,
    salesCount: p.salesCount,
    isFeatured: p.isFeatured,
    tags: p.tags,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/products", async (req, res) => {
  const query = ListProductsQueryParams.safeParse(req.query);
  if (!query.success) return res.status(400).json({ error: query.error });
  const { category, search, sort, limit = 20, offset = 0 } = query.data;

  const conditions = [];
  if (category) conditions.push(eq(productsTable.category, category));
  if (search) conditions.push(ilike(productsTable.title, `%${search}%`));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderBy;
  if (sort === "price_asc") orderBy = asc(sql`CAST(${productsTable.price} AS numeric)`);
  else if (sort === "price_desc") orderBy = desc(sql`CAST(${productsTable.price} AS numeric)`);
  else if (sort === "popular") orderBy = desc(productsTable.salesCount);
  else orderBy = desc(productsTable.createdAt);

  const [products, [{ count }]] = await Promise.all([
    db.select().from(productsTable).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(productsTable).where(whereClause),
  ]);

  const enriched = await Promise.all(
    products.map(async (p) => {
      const [creator] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, p.creatorId));
      const [{ avg, cnt }] = await db
        .select({ avg: sql<number>`coalesce(avg(rating), 0)`, cnt: sql<number>`count(*)` })
        .from(reviewsTable)
        .where(eq(reviewsTable.productId, p.id));
      return formatProduct(p, creator?.name ?? "Unknown", Number(Number(avg).toFixed(1)), Number(cnt));
    }),
  );

  res.json({ products: enriched, total: Number(count) });
});

router.get("/products/featured", async (req, res) => {
  const products = await db.select().from(productsTable).where(eq(productsTable.isFeatured, true)).limit(6);
  const enriched = await Promise.all(
    products.map(async (p) => {
      const [creator] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, p.creatorId));
      const [{ avg, cnt }] = await db
        .select({ avg: sql<number>`coalesce(avg(rating), 0)`, cnt: sql<number>`count(*)` })
        .from(reviewsTable)
        .where(eq(reviewsTable.productId, p.id));
      return formatProduct(p, creator?.name ?? "Unknown", Number(Number(avg).toFixed(1)), Number(cnt));
    }),
  );
  res.json(enriched);
});

router.get("/products/:id", async (req, res) => {
  const params = GetProductParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: params.error });

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!product) return res.status(404).json({ error: "Not found" });

  const [creator] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, product.creatorId));
  const [{ avg, cnt }] = await db
    .select({ avg: sql<number>`coalesce(avg(rating), 0)`, cnt: sql<number>`count(*)` })
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, product.id));

  res.json(formatProduct(product, creator?.name ?? "Unknown", Number(Number(avg).toFixed(1)), Number(cnt)));
});

router.post("/products", async (req, res) => {
  const body = CreateProductBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error });

  const [product] = await db
    .insert(productsTable)
    .values({ ...body.data, price: String(body.data.price), creatorId: MOCK_CREATOR_ID, tags: body.data.tags ?? [] })
    .returning();

  const [creator] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, MOCK_CREATOR_ID));
  res.status(201).json(formatProduct(product, creator?.name ?? "Unknown", 0, 0));
});

router.put("/products/:id", async (req, res) => {
  const params = UpdateProductParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateProductBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid request" });

  const [product] = await db
    .update(productsTable)
    .set({ ...body.data, price: body.data.price !== undefined ? String(body.data.price) : undefined })
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) return res.status(404).json({ error: "Not found" });
  const [creator] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, product.creatorId));
  const [{ avg, cnt }] = await db
    .select({ avg: sql<number>`coalesce(avg(rating), 0)`, cnt: sql<number>`count(*)` })
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, product.id));

  res.json(formatProduct(product, creator?.name ?? "Unknown", Number(Number(avg).toFixed(1)), Number(cnt)));
});

router.delete("/products/:id", async (req, res) => {
  const params = DeleteProductParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: params.error });
  await db.delete(productsTable).where(eq(productsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
