import dummyBooks from "../dummybooks.json";
import { books } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const seed = async () => {
  console.log("Seeding data...");

  try {
    for (const book of dummyBooks) {
      const { id, ...bookData } = book;
      await db.insert(books).values(bookData);
    }

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed();
