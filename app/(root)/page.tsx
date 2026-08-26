import { auth } from "@/auth";
import BookList from "@/components/booklist";
import BookOverview from "@/components/bookOverview";
import { sampleBooks } from "@/constants";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
export default async function Home() {
  const session = await auth();
  const latestBooks = (await db.select().from(books).limit(10).orderBy(desc(books.createdAt)
  )) as Book[]
  return (
    <div>
      <BookOverview {...latestBooks[0]} />
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-20"
      />
    </div>
  );
}
