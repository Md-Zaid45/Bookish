import BookCard from "./bookCard";

interface props {
  title: string;
  books: Book[];
  containerClassName?: string;
}

const BookRow = ({ title, books, containerClassName = "" }: props) => {
  if (books.length < 1) return null;

  return (
    <section className={`w-full min-w-0 ${containerClassName}`}>
      <h2 className="font-bebas-neue text-3xl text-light-100">{title}</h2>
      <ul className="book-row hide-scrollbar">
        {books.map((book, index) => (
          <BookCard key={`${book.id}-${index}`} {...book} />
        ))}
      </ul>
    </section>
  );
};

export default BookRow;
