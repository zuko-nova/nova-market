import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const MOCK_USER_ID = 1;

router.get("/users/me", async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, MOCK_USER_ID));
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? undefined,
    role: user.role,
    bio: user.bio ?? undefined,
    joinedAt: user.joinedAt.toISOString(),
  });
});

export default router;
