import BookOverview from "@/components/bookOverview";
import BookVideo from "@/components/bookVideo";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);
  const userStatus = userId
    ? (
        await db
          .select({ status: users.status })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1)
      )[0]?.status
    : undefined;

  return (
    <div>
      <BookOverview
        {...(bookDetails)}
        userId={userId}
        userStatus={userStatus}
      />
      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3 className="text-white">
              {bookDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </h3>
          </section>
          <section className="mt-10">
            <BookVideo url={bookDetails.videoUrl} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
