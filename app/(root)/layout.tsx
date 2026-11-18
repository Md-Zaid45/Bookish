import { auth } from "@/auth";
import Header from "../../components/header";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
const HomeLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session) redirect("/sign-in");
  
  after(async () => {
    if (!session?.user?.id) return;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);

    if (user[0]?.lastActivityDate === new Date().toISOString().slice(0, 10))
      return;

    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session?.user?.id));
  });
  return (
    <main className="root-container">
      <div className="sticky top-0 z-50 -mx-5 border-b border-white/10 bg-dark-100/60 px-5 backdrop-blur-xl xs:-mx-10 xs:px-10 md:-mx-16 md:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <Header session={session}></Header>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex mt-20 pb-20 items-center">{children}</div>
      </div>
    </main>
  );
};

export default HomeLayout;
