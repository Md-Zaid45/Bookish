"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0)
      return {
        success: false,
        error: "Book is not available for borrowing",
      };

    const dueDate = dayjs().add(7, "day").format("YYYY-MM-DD");

    await db.batch([
      db.insert(borrowRecords).values({
        userId,
        bookId,
        dueDate,
      }),
      db
        .update(books)
        .set({
          availableCopies: sql`${books.availableCopies} - 1`,
        })
        .where(eq(books.id, bookId)),
    ]);

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
