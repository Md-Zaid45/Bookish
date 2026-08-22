import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import '@/styles/admin.css'
import Sidebar from "@/components/admin/sidebar";

const Page=async ({children}:{children:ReactNode}) => {
  const session=await auth()
  if(!session?.user?.id) redirect('/sign-in')
  return (
     <div className="flex min-h-screen w-full">
     <Sidebar/>
     <div className="admin-container"><p>header</p>
     {children}</div>
    </div>
  );
};

export default Page;