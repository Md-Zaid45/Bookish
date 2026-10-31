import { auth } from "@/auth";
import BookList from "@/components/booklist";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import config from "@/lib/config";
import { cn } from "@/lib/utils";
import { Image, ImageKitProvider } from "@imagekit/next";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const STATUS_STYLES: Record<string, string> = {
  APPROVED: "bg-green-800/30 text-green-400 ring-green-400/40",
  PENDING: "bg-primary/15 text-primary ring-primary/40",
  REJECTED: "bg-red-800/30 text-red-400 ring-red-400/40",
};

const formatDate = (value: string | Date | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const MyProfile = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (userRows.length < 1) redirect("/sign-in");

  const user = userRows[0];

  const records = await db
    .select({ record: borrowRecords, book: books })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, user.id))
    .orderBy(desc(borrowRecords.borrowDate));

  const borrowedBooks = records.map(({ record, book }) => ({
    ...book,
    isLoanedBook: true,
    dueDate: record.dueDate,
    borrowStatus: record.status,
  })) as Book[];

  const activeBooks = borrowedBooks.filter(
    (book) => book.borrowStatus === "BORROWED" || book.borrowStatus === "APPROVED",
  ).length;

  const status = user.status ?? "PENDING";
  const initial = user.fullName?.trim()?.charAt(0).toUpperCase() || "?";

  const details = [
    { label: "University ID", value: user.universityId },
    { label: "Role", value: user.role ?? "USER" },
    { label: "Books borrowed", value: activeBooks },
    { label: "Member since", value: formatDate(user.createdAt) },
    { label: "Last active", value: formatDate(user.lastActivityDate) },
  ];

  return (
    <div className="flex w-full flex-col gap-10">
      <section className="w-full">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar size="lg" className="size-16">
            <AvatarFallback className="bg-dark-600 text-2xl font-semibold text-primary">
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-bebas-neue text-3xl text-light-100">
                {user.fullName}
              </h1>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1",
                  STATUS_STYLES[status] ?? STATUS_STYLES.PENDING,
                )}
              >
                {status}
              </span>
            </div>
            <p className="mt-1 break-words text-light-100/70">{user.email}</p>
          </div>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.label} className="min-w-0">
              <dt className="text-xs uppercase tracking-wide text-light-100/50">
                {detail.label}
              </dt>
              <dd className="mt-1 truncate text-base font-semibold text-light-100">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>

        {user.universityCard && (
          <div className="mt-7">
            <h2 className="text-xs uppercase tracking-wide text-light-100/50">
              University card
            </h2>

            <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
              <Image
                src={user.universityCard}
                alt="University card"
                width={320}
                height={200}
                loading="lazy"
                className="mt-2 h-auto w-full max-w-xs rounded-lg object-cover ring-1 ring-white/10"
              />
            </ImageKitProvider>
          </div>
        )}
      </section>

      {borrowedBooks.length > 0 ? (
        <BookList
          title="Borrowed Books"
          books={borrowedBooks}
          containerClassName="w-full"
        />
      ) : (
        <section className="w-full rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <h2 className="font-bebas-neue text-3xl text-light-100">
            Borrowed Books
          </h2>
          <p className="mt-2 text-light-100/70">
            You haven&apos;t borrowed any books yet.
          </p>
        </section>
      )}
    </div>
  );
};
export default MyProfile;
