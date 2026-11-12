import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { sql } from "drizzle-orm";

const BOOK_COLUMNS = sql`b.id, b.title, b.author, b.genre, b.rating,
  b.total_copies AS "totalCopies", b.description,
  b.cover_color AS "coverColor", b.cover_url AS "coverUrl",
  b.video_url AS "videoUrl", b.summary,
  b.available_copies AS "availableCopies", b.created_at AS "createdAt"`;

const fallbackRecommended = async (limit: number) => {
  return db
    .select()
    .from(books)
    .where(sql`${books.availableCopies} > 0`)
    .orderBy(sql`${books.rating} DESC, ${books.createdAt} DESC`)
    .limit(limit);
};

export const getRecommendedBooks = async (userId: string | undefined, limit: number) => {
  if (!userId) return fallbackRecommended(limit);

  const history = await db
    .select({ bookId: borrowRecords.bookId })
    .from(borrowRecords)
    .where(sql`${borrowRecords.userId} = ${userId}`)
    .limit(50);

  if (!history.length) return fallbackRecommended(limit);

  const historyIds = history.map((r) => r.bookId);

  const rows = await db.execute(sql`
    SELECT ${BOOK_COLUMNS}
    FROM books b
    JOIN book_embeddings be ON be.book_id = b.id
    WHERE b.available_copies > 0
      AND b.id NOT IN (${sql.join(historyIds, sql`, `)})
    ORDER BY be.embedding <=> (
      SELECT avg(embedding) FROM book_embeddings
      WHERE book_id IN (${sql.join(historyIds, sql`, `)})
    )
    LIMIT ${limit}
  `);

  return rows.rows;
};

export const getSimilarBooks = async (bookId: string, limit: number) => {
  const rows = await db.execute(sql`
    SELECT ${BOOK_COLUMNS}
    FROM books b
    JOIN book_embeddings be ON be.book_id = b.id
    WHERE b.id != ${bookId}
    ORDER BY be.embedding <=> (
      SELECT embedding FROM book_embeddings WHERE book_id = ${bookId}
    )
    LIMIT ${limit}
  `);

  return rows.rows;
};
