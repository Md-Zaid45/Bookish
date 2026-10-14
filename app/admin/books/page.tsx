import { Suspense } from "react";
import { count, desc } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import BooksTable from "@/components/admin/books-table";
import Pagination from "@/components/admin/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PAGE_SIZE = 10;

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page = "1" } = await searchParams;

  const [{ total }] = await db.select({ total: count() }).from(books);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const allBooks = (await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      description: books.description,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      videoUrl: books.videoUrl,
      summary: books.summary,
      createdAt: books.createdAt,
    })
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(PAGE_SIZE)
    .offset((currentPage - 1) * PAGE_SIZE)) as Book[];

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold text-dark-400">All Books</h1>
          <p className="text-sm font-medium text-light-500">Total: {total}</p>
        </div>
        <Button className="bg-primary-admin">
          <Link href="/admin/books/new">+ Create a New Book</Link>
        </Button>
      </div>
      <div className="mt-7 w-full overflow-hidden">
        <BooksTable books={allBooks} />
        <Suspense>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
