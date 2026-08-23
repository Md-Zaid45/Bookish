import BookForm from "@/components/admin/forms/bookForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <div>
      <Button className="back-btn bg-white text-dark-500 hover:bg-zinc-200">
        <Link href="/admin/books">Go Back</Link>
      </Button>
      <section><BookForm></BookForm></section>{" "}
    </div>
  );
};

export default Page;
