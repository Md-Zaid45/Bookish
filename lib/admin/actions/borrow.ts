"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/utils";

export const updateBookRequest = async ({
  recordId,
  status,
}: UpdateBookRequestParams) => {
  try {
    const admin = await requireAdmin();

    if (!admin)
      return {
        success: false,
        error: "You are not authorized to perform this action",
      };

    const record = await db
      .select({ id: borrowRecords.id, bookId: borrowRecords.bookId, status: borrowRecords.status })
      .from(borrowRecords)
      .where(eq(borrowRecords.id, recordId))
      .limit(1);

    if (!record.length)
      return {
        success: false,
        error: "Borrow request not found",
      };

    if (record[0].status !== "PENDING")
      return {
        success: false,
        error: "This request has already been processed",
      };

    if (status === "APPROVED") {
      const book = await db
        .select({ availableCopies: books.availableCopies })
        .from(books)
        .where(eq(books.id, record[0].bookId))
        .limit(1);

      if (!book.length || book[0].availableCopies <= 0)
        return {
          success: false,
          error: "No copies available to approve this request",
        };

      await db.batch([
        db
          .update(borrowRecords)
          .set({ status })
          .where(eq(borrowRecords.id, recordId)),
        db
          .update(books)
          .set({ availableCopies: book[0].availableCopies - 1 })
          .where(eq(books.id, record[0].bookId)),
      ]);
    } else {
      await db
        .update(borrowRecords)
        .set({ status })
        .where(eq(borrowRecords.id, recordId));
    }

    revalidatePath("/admin/book-requests");

    return {
      success: true,
      error: "",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "Failed to update borrow request",
    };
  }
};
