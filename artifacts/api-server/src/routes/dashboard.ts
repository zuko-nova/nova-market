import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, ordersTable, reviewsTable, usersTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";

const router = Router();

const MOCK_CREATOR_ID = 1;

router.get("/dashboard/stats", async (req, res) => {
  const myProducts = await db.select().from(productsTable).where(eq(productsTable.creatorId, MOCK_CREATOR_ID));
  const productIds = myProducts.map((p) => p.id);

  let totalRevenue = 0;
  let totalSales = 0;
  let revenueThisMonth = 0;
  let salesThisMonth = 0;

  if (productIds.length > 0) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    for (const pid of productIds) {
      const orders = await db.select().from(ordersTable).where(eq(ordersTable.productId, pid));
      for (const o of orders) {
        const amount = Number(o.amount);
        totalRevenue += amount;
        totalSales += 1;
        if (o.createdAt >= startOfMonth) {
          revenueThisMonth += amount;
          salesThisMonth += 1;
        }
      }
    }
  }

  let totalReviews = 0;
  for (const pid of productIds) {
    const [{ cnt }] = await db
      .select({ cnt: sql<number>`count(*)` })
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, pid));
    totalReviews += Number(cnt);
  }

  const topProducts = myProducts
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl ?? undefined,
      category: p.category,
      creatorName: "You",
      creatorId: p.creatorId,
      rating: 0,
      reviewCount: 0,
      salesCount: p.salesCount,
      isFeatured: p.isFeatured,
      tags: p.tags,
      createdAt: p.createdAt.toISOString(),
    }));

  const recentOrderRows = productIds.length > 0
    ? await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(5)
    : [];

  const recentOrders = await Promise.all(
    recentOrderRows.map(async (o) => {
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

  res.json({
    totalRevenue,
    totalSales,
    totalProducts: myProducts.length,
    totalReviews,
    revenueThisMonth,
    salesThisMonth,
    topProducts,
    recentOrders,
  });
});

router.get("/dashboard/products", async (req, res) => {
  const products = await db.select().from(productsTable).where(eq(productsTable.creatorId, MOCK_CREATOR_ID));
  const enriched = products.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: Number(p.price),
    imageUrl: p.imageUrl ?? undefined,
    category: p.category,
    creatorName: "You",
    creatorId: p.creatorId,
    rating: 0,
    reviewCount: 0,
    salesCount: p.salesCount,
    isFeatured: p.isFeatured,
    tags: p.tags,
    createdAt: p.createdAt.toISOString(),
  }));
  res.json(enriched);
});

export default router;
