import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const requireAdmin = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const user = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user.length || user[0].role !== "ADMIN") return null;

  return user[0];
};
