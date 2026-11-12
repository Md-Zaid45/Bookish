"use server";

import { db } from "@/database/drizzle";
import { bookEmbeddings, books } from "@/database/schema";
import { bookEmbeddingText, embedBatch } from "@/lib/embeddings";

const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({ ...params, availableCopies: params.totalCopies })
      .returning();

    const book = newBook[0];

    try {
      const [embedding] = await embedBatch(
        [bookEmbeddingText(book)],
        "RETRIEVAL_DOCUMENT"
      );
      await db
        .insert(bookEmbeddings)
        .values({ bookId: book.id, embedding })
        .onConflictDoUpdate({
          target: bookEmbeddings.bookId,
          set: { embedding, updatedAt: new Date() },
        });
    } catch (error) {
      console.error(
        `Failed to create embedding for book ${book.id} — backfill with npm run db:embed`,
        error
      );
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(book)),
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add book",
    };
  }
};

export default createBook
