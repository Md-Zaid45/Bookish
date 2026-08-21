import { signOut } from "@/auth";
import BookList from "@/components/booklist";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";

const MyProfile = () => {
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
        books={sampleBooks}
        containerClassName="mt-20"
      />
    </div>
  );
};
export default MyProfile;
