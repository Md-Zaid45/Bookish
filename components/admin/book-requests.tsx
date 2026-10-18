"use client";

import { useState } from "react";
import { toast } from "@/components/ui/toast";
import Bookcover from "@/components/bookcover";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import { updateBookRequest } from "@/lib/admin/actions/borrow";

const formatDate = (date: Date | string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const STATUS_STYLES: Record<BorrowRecord["status"], string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "confirm-approve",
  BORROWED: "confirm-approve",
  REJECTED: "confirm-reject",
};

const BookRequests = ({ requests }: { requests: BorrowRecord[] }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [selectedId, setSelectedId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (recordId: string, action: "APPROVE" | "REJECT") => {
    setSelectedId(recordId);
    setType(action);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);

    const result = await updateBookRequest({
      recordId: selectedId,
      status: type === "APPROVE" ? "APPROVED" : "REJECTED",
    });

    setIsProcessing(false);

    if (result.success) {
      setOpen(false);
      toast.add({
        type: "success",
        title: `Request ${type === "APPROVE" ? "approved" : "rejected"}`,
        description:
          type === "APPROVE"
            ? "The book copies have been updated"
            : "The borrow request has been rejected",
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
        No borrow requests found.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {requests.map((request) => (
        <div key={request.id} className="book-stripe items-center">
          <div className="flex flex-1 flex-row items-center gap-4">
            <Bookcover
              variant="small"
              coverColor={request.book.coverColor}
              coverImage={request.book.coverUrl}
            />
            <div className="flex flex-col">
              <p className="title">{request.book.title}</p>
              <div className="author">
                <p>{request.book.author}</p>
                <div />
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[request.status]}`}
                >
                  {request.status}
                </span>
              </div>
              <div className="user">
                <div className="avatar">
                  <p className="font-semibold">
                    {request.user.fullName} · {request.user.email}
                  </p>
                </div>
                <div className="borrow-date">
                  <p>Borrowed: {formatDate(request.borrowDate)}</p>
                </div>
                <div className="borrow-date">
                  <p>Due: {formatDate(request.dueDate)}</p>
                </div>
              </div>
            </div>
          </div>
          {request.status === "PENDING" && (
            <div className="flex flex-row gap-2">
              <button
                className="confirm-trigger confirm-approve rounded-md px-4 py-2"
                onClick={() => handleAction(request.id, "APPROVE")}
              >
                Approve
              </button>
              <button
                className="confirm-trigger confirm-reject rounded-md px-4 py-2"
                onClick={() => handleAction(request.id, "REJECT")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={
          type === "APPROVE" ? "Approve Request" : "Reject Request"
        }
        description={
          type === "APPROVE"
            ? "Are you sure you want to approve this borrow request? A copy will be reserved for the user."
            : "Are you sure you want to reject this borrow request? This action cannot be undone."
        }
        type={type}
        onConfirm={handleConfirm}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default BookRequests;
