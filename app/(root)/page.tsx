import BookList from "@/components/booklist";
import BookOverview from "@/components/bookOverview";
import { sampleBooks } from "@/constants";

export default function Home() {
  return (<div>
  <BookOverview {...sampleBooks[0]}/>
  <BookList
   title="Latest Books"
   books={sampleBooks}
   containerClassName='mt-20'
  />
  </div>
  );
}
