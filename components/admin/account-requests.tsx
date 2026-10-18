"use client";

import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import { updateUserRequest } from "@/lib/admin/actions/user";

const formatDate = (date: Date | null) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const AccountRequests = ({ requests }: { requests: User[] }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [selectedId, setSelectedId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (userId: string, action: "APPROVE" | "REJECT") => {
    setSelectedId(userId);
    setType(action);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);

    const result = await updateUserRequest({
      userId: selectedId,
      status: type === "APPROVE" ? "APPROVED" : "REJECTED",
    });

    setIsProcessing(false);

    if (result.success) {
      setOpen(false);
      toast.add({
        type: "success",
        title: `Account ${type === "APPROVE" ? "approved" : "rejected"}`,
        description:
          type === "APPROVE"
            ? "The user can now borrow books"
            : "The account request has been rejected",
      });
    } else {
      toast.add({
        type: "error",
        title: "Update failed",
        description: result.error,
      });
    }
  };

  if (requests.length === 0) {
    return (
      <p className="py-10 text-center text-sm font-medium text-light-500">
        No account requests found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">
              User
            </th>
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">
              University ID
            </th>
            <th className="pb-4 pr-4 text-sm font-medium text-light-500">
              Requested
            </th>
            <th className="pb-4 text-sm font-medium text-light-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((user) => (
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
              <td className="py-3.5 pr-4 text-sm text-dark-200">
                {formatDate(user.createdAt)}
              </td>
              <td className="py-3.5">
                <div className="flex flex-row gap-2">
                  <button
                    className="confirm-trigger confirm-approve rounded-md px-4 py-2"
                    onClick={() => handleAction(user.id, "APPROVE")}
                  >
                    Approve
                  </button>
                  <button
                    className="confirm-trigger confirm-reject rounded-md px-4 py-2"
                    onClick={() => handleAction(user.id, "REJECT")}
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={type === "APPROVE" ? "Approve Account" : "Reject Account"}
        description={
          type === "APPROVE"
            ? "Are you sure you want to approve this account? The user will be able to borrow books."
            : "Are you sure you want to reject this account? The user will not be able to borrow books."
        }
        type={type}
        onConfirm={handleConfirm}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default AccountRequests;
