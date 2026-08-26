import BookCard from "./bookCard";

interface props {
  title: string;
  books: Book[];
  containerClassName: string;
}
const BookList = ({ title, books, containerClassName }: props) => {
  if(books.length<1) return
  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-3xl text-light-100">{title}</h2>
      <ul className="book-list">
        {
          books.map(book=><BookCard key={book.title} {...book} ></BookCard>)
        }
      </ul>
    </section>
  );
};

export default BookList;
