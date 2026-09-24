"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const session = await auth();
    const sessionUserId = session?.user?.id;

    if (!sessionUserId || sessionUserId !== userId)
      return {
        success: false,
        error: "Please sign in to borrow this book",
      };

    const user = await db
      .select({ status: users.status })
      .from(users)
      .where(eq(users.id, sessionUserId))
      .limit(1);

    if (!user.length || user[0].status !== "APPROVED")
      return {
        success: false,
        error: "Your account is not approved for borrowing",
      };

    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0)
      return {
        success: false,
        error: "No book available",
      };

    const dueDate = dayjs().add(7, "day").format("YYYY-MM-DD");

    await db.batch([
      db.insert(borrowRecords).values({
        userId: sessionUserId,
        bookId,
        dueDate,
      }),
      db
        .update(books)
        .set({ availableCopies: book[0].availableCopies - 1 })
        .where(eq(books.id, bookId)),
    ]);

    revalidatePath(`/books/${bookId}`);
    revalidatePath("/");

    return {
      success: true,
      error: "",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "Failed to borrow book",
    };
  }
};
