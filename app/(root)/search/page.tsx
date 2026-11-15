import BookList from "@/components/booklist";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, ilike, or } from "drizzle-orm";
import { Search } from "lucide-react";

const RESULT_LIMIT = 24;

const escapeLike = (value: string) =>
  value.replace(/[\\%_]/g, (char) => `\\${char}`);

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const { query = "" } = await searchParams;
  const term = query.trim();

  const results: Book[] = term
    ? ((await db
        .select()
        .from(books)
        .where(
          or(
            ilike(books.title, `%${escapeLike(term)}%`),
            ilike(books.author, `%${escapeLike(term)}%`),
            ilike(books.genre, `%${escapeLike(term)}%`),
          ),
        )
        .orderBy(desc(books.rating), desc(books.createdAt))
        .limit(RESULT_LIMIT)) as Book[])
    : [];

  return (
    <div className="flex w-full min-w-0 flex-col">
      <h1 className="font-bebas-neue text-4xl text-light-100">Search</h1>

      <form method="GET" action="/search" className="search">
        <Search className="mr-3 size-5 shrink-0 text-light-100" />
        <input
          type="search"
          name="query"
          defaultValue={term}
          placeholder="Search by title, author, or genre..."
          aria-label="Search books"
          className="search-input"
        />
        <button
          type="submit"
          className="ml-3 shrink-0 rounded-lg bg-primary px-4 py-1.5 font-semibold text-dark-400 transition-colors hover:bg-light-200"
        >
          Search
        </button>
      </form>

      {term === "" ? (
        <p className="mt-10 text-light-100/70">
          Start typing to search the library.
        </p>
      ) : results.length > 0 ? (
        <BookList
          title={`Results for "${term}"`}
          books={results}
          containerClassName="mt-10"
        />
      ) : (
        <section className="mt-10 w-full rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <h2 className="font-bebas-neue text-3xl text-light-100">
            No Results
          </h2>
          <p className="mt-2 text-light-100/70">
            We couldn&apos;t find any books matching &quot;{term}&quot;.
          </p>
        </section>
      )}
    </div>
  );
};

export default SearchPage;
