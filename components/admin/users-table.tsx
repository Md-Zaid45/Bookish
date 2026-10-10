import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formatDate = (date: Date | null) =>
  date ? new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) : "—";

const UsersTable = ({ users }: { users: User[] }) => {
  if (users.length === 0) {
    return (
      <p className="py-10 text-center text-sm font-medium text-light-500">
        No users found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">User</th>
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">University ID</th>
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">Role</th>
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">Status</th>
            <th className="pb-4 text-sm font-medium text-light-500">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 transition-colors hover:bg-light-300"
            >
              <td className="py-3.5 pr-4">
                <div className="flex flex-row items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary-admin font-semibold text-white">
                      {user.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-dark-400">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-light-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 pr-4 text-sm text-dark-200">
                {user.universityId}
              </td>
              <td className="py-3.5 pr-4">
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                    user.role === "ADMIN"
                      ? "bg-primary-admin text-white"
                      : "bg-light-300 text-dark-300"
                  }`}
                >
                  {user.role ?? "USER"}
                </span>
              </td>
              <td className="py-3.5 pr-4">
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                    user.status === "APPROVED"
                      ? "confirm-approve"
                      : "confirm-reject"
                  }`}
                >
                  {user.status ?? "PENDING"}
                </span>
              </td>
              <td className="py-3.5 text-sm text-dark-200">
                {formatDate(user.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
