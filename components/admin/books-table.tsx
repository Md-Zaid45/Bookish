import Link from "next/link";
import Bookcover from "@/components/bookcover";

const formatDate = (date: Date | null) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const BooksTable = ({ books }: { books: Book[] }) => {
  if (books.length === 0) {
    return (
      <p className="py-10 text-center text-sm font-medium text-light-500">
        No books found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">
              Book
            </th>
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">
              Genre
            </th>
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">
              Rating
            </th>
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">
              Copies
            </th>
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">
              Added
            </th>
            <th className="pb-4 text-sm font-medium text-light-500"> </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              key={book.id}
              className="border-b border-gray-100 transition-colors hover:bg-light-300"
            >
              <td className="py-3.5 pr-4">
                <div className="flex flex-row items-center gap-3">
                  <Bookcover
                    variant="small"
                    coverColor={book.coverColor}
                    coverImage={book.coverUrl}
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-dark-400 line-clamp-1">
                      {book.title}
                    </p>
                    <p className="text-xs text-light-500 line-clamp-1">
                      {book.author}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 pr-4">
                <span className="inline-flex items-center rounded-md bg-light-300 px-2.5 py-1 text-xs font-semibold text-dark-300">
                  {book.genre}
                </span>
              </td>
              <td className="py-3.5 pr-4 text-sm font-medium text-dark-200">
                {book.rating}/5
              </td>
              <td className="py-3.5 pr-4 text-sm text-dark-200">
                <span
                  className={`font-semibold ${
                    book.availableCopies > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {book.availableCopies}
                </span>
                <span className="text-light-500"> / {book.totalCopies}</span>
              </td>
              <td className="py-3.5 pr-4 text-sm text-dark-200">
                {formatDate(book.createdAt)}
              </td>
              <td className="py-3.5 text-right">
                <Link
                  href={`/books/${book.id}`}
                  className="view-btn inline-flex items-center px-3 py-1.5 text-xs"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BooksTable;
