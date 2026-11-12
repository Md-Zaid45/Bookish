import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { bookEmbeddings, books } from "@/database/schema";
import { bookEmbeddingText, embedBatch } from "@/lib/embeddings";

config({ path: ".env.local" });

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sqlClient });

const BATCH_SIZE = 20;

const run = async () => {
  console.log("Embedding books...");

  try {
    const missing = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        summary: books.summary,
        description: books.description,
      })
      .from(books)
      .leftJoin(bookEmbeddings, sql`${bookEmbeddings.bookId} = ${books.id}`)
      .where(sql`${bookEmbeddings.id} IS NULL`);

    if (!missing.length) {
      console.log("All books already embedded. Nothing to do.");
      return;
    }

    console.log(`${missing.length} books missing embeddings.`);

    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const batch = missing.slice(i, i + BATCH_SIZE);
      const vectors = await embedBatch(
        batch.map((book) => bookEmbeddingText(book)),
        "RETRIEVAL_DOCUMENT"
      );

      for (const [idx, book] of batch.entries()) {
        await db
          .insert(bookEmbeddings)
          .values({
            bookId: book.id,
            embedding: vectors[idx],
            model: "gemini-embedding-001",
          })
          .onConflictDoUpdate({
            target: bookEmbeddings.bookId,
            set: {
              embedding: vectors[idx],
              model: "gemini-embedding-001",
              updatedAt: new Date(),
            },
          });
      }

      console.log(
        `Embedded ${Math.min(i + BATCH_SIZE, missing.length)}/${missing.length}`
      );
    }

    console.log("Done.");
  } catch (error) {
    console.error("Error embedding books:", error);
    process.exitCode = 1;
  }
};

run();
