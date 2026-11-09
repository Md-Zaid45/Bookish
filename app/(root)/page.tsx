import { auth } from "@/auth";
import BookOverview from "@/components/bookOverview";
import BookRow from "@/components/bookRow";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { asc, count, desc, eq, gt } from "drizzle-orm";

const SECTION_LIMIT = 12;
const GENRE_SECTION_LIMIT = 3;

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

  const [latestBooks, bestBooks, recommendedBooks, trendingRows, topGenres] =
    await Promise.all([
      db
        .select()
        .from(books)
        .orderBy(desc(books.createdAt))
        .limit(SECTION_LIMIT),
      db
        .select()
        .from(books)
        .orderBy(desc(books.rating), asc(books.createdAt))
        .limit(SECTION_LIMIT),
      db
        .select()
        .from(books)
        .where(gt(books.availableCopies, 0))
        .orderBy(desc(books.rating), desc(books.createdAt))
        .limit(SECTION_LIMIT),
      db
        .select({ book: books, borrowCount: count(borrowRecords.id) })
        .from(books)
        .leftJoin(borrowRecords, eq(borrowRecords.bookId, books.id))
        .groupBy(books.id)
        .orderBy(desc(count(borrowRecords.id)), desc(books.rating))
        .limit(SECTION_LIMIT),
      db
        .select({ genre: books.genre })
        .from(books)
        .groupBy(books.genre)
        .orderBy(desc(count()), desc(books.genre))
        .limit(GENRE_SECTION_LIMIT),
    ]);

  const trendingBooks = trendingRows.map((row) => row.book as Book);

  const genreSections = await Promise.all(
    topGenres.map(async ({ genre }) => ({
      genre,
      books: (await db
        .select()
        .from(books)
        .where(eq(books.genre, genre))
        .orderBy(desc(books.rating), desc(books.createdAt))
        .limit(SECTION_LIMIT)) as Book[],
    })),
  );

  const featuredBook = latestBooks[0] as Book;

  return (
    <div className="flex w-full min-w-0 flex-col">
      <BookOverview
        {...featuredBook}
        userId={userId}
        userStatus={userStatus}
      />
      <BookRow
        title="Trending Now"
        books={trendingBooks}
        containerClassName="mt-20"
      />
      <BookRow
        title="Recommended For You"
        books={recommendedBooks as Book[]}
        containerClassName="mt-14"
      />
      <BookRow
        title="Best of All Time"
        books={bestBooks as Book[]}
        containerClassName="mt-14"
      />
      <BookRow
        title="Latest Books"
        books={(latestBooks.slice(1) as Book[])}
        containerClassName="mt-14"
      />
      {genreSections.map(({ genre, books: genreBooks }) => (
        <BookRow
          key={genre}
          title={genre}
          books={genreBooks}
          containerClassName="mt-14"
        />
      ))}
    </div>
  );
}
