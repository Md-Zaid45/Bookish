import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import '@/styles/admin.css'
import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";
import { requireAdmin } from "@/lib/admin/utils";

const Page=async ({children}:{children:ReactNode}) => {
  const session=await auth()
  if(!session?.user?.id) redirect('/sign-in')

  const admin = await requireAdmin()
  if(!admin) redirect('/')
  return (
     <div className="flex min-h-screen w-full flex-row">
     <Sidebar session={session}/>
     <div className="admin-container"><Header session={session}/>
     {children}</div>
    </div>
  );
};

export default Page;