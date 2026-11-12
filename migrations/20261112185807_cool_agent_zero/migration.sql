CREATE TABLE "book_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"book_id" uuid NOT NULL UNIQUE,
	"embedding" vector(384) NOT NULL,
	"model" text DEFAULT 'Xenova/all-MiniLM-L6-v2' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "book_embeddings_hnsw_idx" ON "book_embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
ALTER TABLE "book_embeddings" ADD CONSTRAINT "book_embeddings_book_id_books_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE;