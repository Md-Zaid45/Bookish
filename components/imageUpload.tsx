import { Button } from "./ui/button"

const ImageUpload=()=>{
  return <div className=" flex flex-col gap-2">
    <p className="font-semibold">Upload the image of University Id card</p>
  <Button className='max-w-30 bg-zinc-500 font-semibold text-sm hover:bg-zinc-600'>Upload Image</Button>
  </div>
}

export default ImageUpload