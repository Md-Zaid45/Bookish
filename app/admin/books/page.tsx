import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <section w-full rounded-2xl bg-white p-7>
      <div className="flex flex-wrap item-center justify-between gap-2">
        <h1 className="text-xl font-semibold">All Books</h1>
        <Button className='bg-primary-admin'>
          <Link href="/admin/books/new">+ Create a New Book</Link>
        </Button>
      </div>
      <div className="mt-7 overflow-hidden w-full">Table</div>
    </section>
  );
};

export default Page;
