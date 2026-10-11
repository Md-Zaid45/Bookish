import { Suspense } from "react";
import { count, desc } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import UsersTable from "@/components/admin/users-table";
import Pagination from "@/components/admin/pagination";

const PAGE_SIZE = 10;

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page = "1" } = await searchParams;

  const [{ total }] = await db.select({ total: count() }).from(users);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const allUsers = (await db
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
    .orderBy(desc(users.createdAt))
    .limit(PAGE_SIZE)
    .offset((currentPage - 1) * PAGE_SIZE)) as User[];

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-dark-400">All Users</h1>
        <p className="text-sm font-medium text-light-500">Total: {total}</p>
      </div>
      <div className="mt-7 w-full overflow-hidden">
        <UsersTable users={allUsers} />
        <Suspense>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
