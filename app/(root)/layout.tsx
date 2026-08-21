import { auth } from "@/auth";
import Header from "../../components/header";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
const HomeLayout = async({ children }: { children: ReactNode }) => {
  const session = await auth()
      if(!session) redirect('/sign-in')

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session}></Header>
        <div className="flex mt-20 pb-20 items-center">{children}</div>
      </div>
    </main>
  );
};

export default HomeLayout;
