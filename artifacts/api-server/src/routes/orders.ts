import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateOrderBody } from "@workspace/api-zod";

const router = Router();

const MOCK_BUYER_ID = 2;

router.get("/orders", async (req, res) => {
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.buyerId, MOCK_BUYER_ID))
    .orderBy(desc(ordersTable.createdAt));

  const enriched = await Promise.all(
    orders.map(async (o) => {
      const [product] = await db
        .select({ title: productsTable.title, imageUrl: productsTable.imageUrl })
        .from(productsTable)
        .where(eq(productsTable.id, o.productId));
      return {
        id: o.id,
        productId: o.productId,
        productTitle: product?.title ?? "Unknown",
        productImageUrl: product?.imageUrl ?? undefined,
        amount: Number(o.amount),
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      };
    }),
  );

  res.json(enriched);
});

router.post("/orders", async (req, res) => {
  const body = CreateOrderBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error });

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, body.data.productId));
  if (!product) return res.status(404).json({ error: "Product not found" });

  const [order] = await db
    .insert(ordersTable)
    .values({ productId: body.data.productId, buyerId: MOCK_BUYER_ID, amount: product.price, status: "completed" })
    .returning();

  await db
    .update(productsTable)
    .set({ salesCount: product.salesCount + 1 })
    .where(eq(productsTable.id, product.id));

  res.status(201).json({
    id: order.id,
    productId: order.productId,
    productTitle: product.title,
    productImageUrl: product.imageUrl ?? undefined,
    amount: Number(order.amount),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  });
});

export default router;
