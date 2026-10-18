"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/utils";

export const updateUserRequest = async ({
  userId,
  status,
}: UpdateUserRequestParams) => {
  try {
    const admin = await requireAdmin();

    if (!admin)
      return {
        success: false,
        error: "You are not authorized to perform this action",
      };

    const user = await db
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length)
      return {
        success: false,
        error: "User not found",
      };

    if (user[0].status !== "PENDING")
      return {
        success: false,
        error: "This request has already been processed",
      };

    await db.update(users).set({ status }).where(eq(users.id, userId));

    revalidatePath("/admin/account-requests");

    return {
      success: true,
      error: "",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "Failed to update account request",
    };
  }
};
