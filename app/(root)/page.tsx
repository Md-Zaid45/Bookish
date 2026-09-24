import { auth } from "@/auth";
import BookList from "@/components/booklist";
import BookOverview from "@/components/bookOverview";
import { sampleBooks } from "@/constants";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  const userStatus = userId
    ? (
        await db
          .select({ status: users.status })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1)
      )[0]?.status
    : undefined;
  const latestBooks = (await db.select().from(books).limit(10).orderBy(desc(books.createdAt)
  )) as Book[]
  return (
    <div>
      <BookOverview
        {...latestBooks[0]}
        userId={userId}
        userStatus={userStatus}
      />
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-20"
      />
    </div>
  );
}
