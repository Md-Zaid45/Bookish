import Link from "next/link"
import Bookcover from "./bookcover"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "./ui/button"

interface props{
  id:string, title:string, genre:string, coverColor:string, coverUrl:string, isLoanedBook?:boolean
}
const BookCard=({id, title, genre, coverColor, coverUrl,isLoanedBook=false}:props)=>{
  return <li className={cn(isLoanedBook && 'xs:w-52 w-full')}>
<Link href={`/books/${id}`}
className={cn(isLoanedBook && 'w-full flex flex-col item-center')}
>
<Bookcover coverColor={coverColor} coverImage={coverUrl} variant="regular"></Bookcover>
<div className={cn('mt-4', !isLoanedBook && 'xs:max-w-40 max-w-28')}>
 <p className="book-title">{title}</p>
 <p className="book-genre">{genre}</p>

  {isLoanedBook && (<div>
     <div className="book-loaned">
      <Image src='/icons/calendar.svg' alt="Calendar" width={18} height={18}/>
      <p className="text-light-100">!! days left to return</p>
     </div>
        <Button className='book-btn'>Download receit</Button>
  </div>)}
 </div>
</Link>
  </li>
}

export default BookCard