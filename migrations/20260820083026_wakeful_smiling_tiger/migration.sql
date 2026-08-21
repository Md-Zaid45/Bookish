CREATE TYPE "borrow_status_enum" AS ENUM('APPROVED', 'PENDING', 'REJECTED');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "status" AS ENUM('APPROVED', 'PENDING', 'REJECTED');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"full_name" varchar(255) NOT NULL,
	"email" text NOT NULL UNIQUE,
	"university_id" integer NOT NULL,
	"university_card" text NOT NULL,
	"status" "status" DEFAULT 'PENDING'::"status",
	"role" "role" DEFAULT 'USER'::"role",
	"last_active" date DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
