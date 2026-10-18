import { Suspense } from "react";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import BookRequests from "@/components/admin/book-requests";
import Pagination from "@/components/admin/pagination";

const PAGE_SIZE = 10;

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page = "1" } = await searchParams;

  const [{ total }] = await db.select({ total: count() }).from(borrowRecords);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const allRequests = (await db
    .select({
      id: borrowRecords.id,
      userId: borrowRecords.userId,
      bookId: borrowRecords.bookId,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      createdAt: borrowRecords.createdAt,
      user: {
        fullName: users.fullName,
        email: users.email,
      },
      book: {
        title: books.title,
        author: books.author,
        coverColor: books.coverColor,
        coverUrl: books.coverUrl,
      },
    })
    .from(borrowRecords)
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .orderBy(desc(borrowRecords.borrowDate))
    .limit(PAGE_SIZE)
    .offset((currentPage - 1) * PAGE_SIZE)) as BorrowRecord[];

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-dark-400">
          Borrow Requests
        </h1>
        <p className="text-sm font-medium text-light-500">Total: {total}</p>
      </div>
      <div className="mt-7 w-full overflow-hidden">
        <BookRequests requests={allRequests} />
        <Suspense>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
