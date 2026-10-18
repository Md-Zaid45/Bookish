interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  isLoanedBook?: boolean;
  createdAt: Date | null;
}

interface AuthCredentials{
  password:string,
  fullName:string,
  email:string,
  universityId:number,
  universityCard:string
}

interface BookParams{
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams{
  bookId:string;
  userId:string;
}

interface User{
  id:string;
  fullName:string;
  email:string;
  universityId:number;
  status:"APPROVED"|"PENDING"|"REJECTED"|null;
  role:"ADMIN"|"USER"|null;
  createdAt:Date|null;
}

interface BorrowRecord{
  id:string;
  userId:string;
  bookId:string;
  borrowDate:Date;
  dueDate:string;
  returnDate:string|null;
  status:"APPROVED"|"BORROWED"|"PENDING"|"REJECTED";
  createdAt:Date|null;
  user:{
    fullName:string;
    email:string;
  };
  book:{
    title:string;
    author:string;
    coverColor:string;
    coverUrl:string;
  };
}

interface UpdateBookRequestParams{
  recordId:string;
  status:"APPROVED"|"REJECTED";
}

interface UpdateUserRequestParams{
  userId:string;
  status:"APPROVED"|"REJECTED";
}