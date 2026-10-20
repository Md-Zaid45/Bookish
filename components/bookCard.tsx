import Link from "next/link"
import Bookcover from "./bookcover"
import { cn } from "@/lib/utils"
import Image from "next/image"
import dayjs from "dayjs"

interface props{
  id:string, title:string, genre:string, coverColor:string, coverUrl:string, isLoanedBook?:boolean,
  dueDate?:string|null, borrowStatus?:Book["borrowStatus"]
}

const BORROW_STATUS: Record<NonNullable<props["borrowStatus"]>, { label: string; className: string }> = {
  PENDING: { label: "Request pending", className: "bg-primary/15 text-primary ring-primary/40" },
  APPROVED: { label: "Approved", className: "bg-green-800/30 text-green-400 ring-green-400/40" },
  BORROWED: { label: "Borrowed", className: "bg-blue-100/15 text-blue-100 ring-blue-100/40" },
  REJECTED: { label: "Rejected", className: "bg-red-800/30 text-red-400 ring-red-400/40" },
};

const BookCard=({id, title, genre, coverColor, coverUrl,isLoanedBook=false,dueDate,borrowStatus}:props)=>{
  const isDueDateVisible =
    !!dueDate && (borrowStatus === "BORROWED" || borrowStatus === "APPROVED");
  const daysLeft = dueDate
    ? dayjs(dueDate).startOf("day").diff(dayjs().startOf("day"), "day")
    : null;
  const status = borrowStatus ? BORROW_STATUS[borrowStatus] : null;

  return <li className={cn(isLoanedBook && 'xs:w-52 w-full')}>
<Link href={`/books/${id}`}
className={cn(isLoanedBook && 'w-full flex flex-col item-center')}
>
<Bookcover coverColor={coverColor} coverImage={coverUrl} variant="regular"></Bookcover>
<div className={cn('mt-4', !isLoanedBook && 'xs:max-w-40 max-w-28')}>
 <p className="book-title">{title}</p>
 <p className="book-genre">{genre}</p>

  {isLoanedBook && (<div className="mt-3 w-full">
     {isDueDateVisible && (
       <div className="book-loaned">
         <Image src='/icons/calendar.svg' alt="Calendar" width={18} height={18}/>
         <p className={cn("text-light-100", (daysLeft ?? 0) < 0 && "text-red-400")}>
           {(daysLeft ?? 0) < 0
             ? `${Math.abs(daysLeft ?? 0)} days overdue`
             : `${daysLeft} days left to return`}
         </p>
       </div>
     )}
     {status && (
       <span className={cn("mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", status.className)}>
         {status.label}
       </span>
     )}
  </div>)}
 </div>
</Link>
  </li>
}

export default BookCard
