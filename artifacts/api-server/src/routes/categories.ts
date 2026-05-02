import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  const categories = await db.select().from(categoriesTable);
  const enriched = await Promise.all(
    categories.map(async (c) => {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(productsTable)
        .where(eq(productsTable.category, c.slug));
      return { id: c.id, name: c.name, slug: c.slug, productCount: Number(count) };
    }),
  );
  res.json(enriched);
});

export default router;
