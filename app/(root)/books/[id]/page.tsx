import BookOverview from "@/components/bookOverview";
import BookVideo from "@/components/bookVideo";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);
  return (
    <div>
      <BookOverview {...bookDetails} />
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
