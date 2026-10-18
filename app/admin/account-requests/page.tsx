import { Suspense } from "react";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import AccountRequests from "@/components/admin/account-requests";
import Pagination from "@/components/admin/pagination";

const PAGE_SIZE = 10;

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page = "1" } = await searchParams;

  const [{ total }] = await db
    .select({ total: count() })
    .from(users)
    .where(eq(users.status, "PENDING"));

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const accountRequests = (await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      status: users.status,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.status, "PENDING"))
    .orderBy(desc(users.createdAt))
    .limit(PAGE_SIZE)
    .offset((currentPage - 1) * PAGE_SIZE)) as User[];

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-dark-400">
          Account Requests
        </h1>
        <p className="text-sm font-medium text-light-500">Total: {total}</p>
      </div>
      <div className="mt-7 w-full overflow-hidden">
        <AccountRequests requests={accountRequests} />
        <Suspense>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
