import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { ListReviewsParams, CreateReviewParams, CreateReviewBody } from "@workspace/api-zod";

const router = Router();

const MOCK_REVIEWER_ID = 2;

router.get("/products/:id/reviews", async (req, res) => {
  const params = ListReviewsParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: params.error });

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, params.data.id))
    .orderBy(desc(reviewsTable.createdAt));

  const enriched = await Promise.all(
    reviews.map(async (r) => {
      const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, r.reviewerId));
      return {
        id: r.id,
        productId: r.productId,
        reviewerName: user?.name ?? "Anonymous",
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
      };
    }),
  );

  res.json(enriched);
});

router.post("/products/:id/reviews", async (req, res) => {
  const params = CreateReviewParams.safeParse({ id: Number(req.params.id) });
  const body = CreateReviewBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid request" });

  const [review] = await db
    .insert(reviewsTable)
    .values({ productId: params.data.id, reviewerId: MOCK_REVIEWER_ID, ...body.data })
    .returning();

  const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, MOCK_REVIEWER_ID));
  res.status(201).json({
    id: review.id,
    productId: review.productId,
    reviewerName: user?.name ?? "Anonymous",
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
  });
});

export default router;
