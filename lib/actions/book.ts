"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";
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

    const existingRequest = await db
      .select({ id: borrowRecords.id })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, sessionUserId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "PENDING"),
        ),
      )
      .limit(1);

    if (existingRequest.length > 0)
      return {
        success: false,
        error: "You already have a pending request for this book",
      };

    const dueDate = dayjs().add(7, "day").format("YYYY-MM-DD");

    await db.insert(borrowRecords).values({
      userId: sessionUserId,
      bookId,
      dueDate,
      status: "PENDING",
      createdAt: new Date(),
    });

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
