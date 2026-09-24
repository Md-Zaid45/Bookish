ALTER TYPE "borrow_status_enum" ADD VALUE 'BORROWED' BEFORE 'PENDING';--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"genre" text NOT NULL,
	"rating" integer NOT NULL,
	"total_copies" integer NOT NULL,
	"description" text NOT NULL,
	"cover_color" varchar(7) NOT NULL,
	"cover_url" text NOT NULL,
	"video_url" text NOT NULL,
	"summary" text NOT NULL,
	"available_copies" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "borrow_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"user_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"borrow_date" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" date NOT NULL,
	"return_date" date,
	"status" "borrow_status_enum" DEFAULT 'BORROWED'::"borrow_status_enum" NOT NULL,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_book_id_books_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id");