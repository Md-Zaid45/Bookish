import { signOut } from "@/auth";
import BookList from "@/components/booklist";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";

const MyProfile = async () => {
  const recommendedBooks = (await db.select().from(books).limit(10).orderBy(desc(books.createdAt))) as Book[]
  return (
    <div className="flex items-start">
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit">LogOut</Button>
      </form>

      <BookList
        title="Borrowed Books"
        books={recommendedBooks}
        containerClassName="mt-20"
      />
    </div>
  );
};
export default MyProfile;
