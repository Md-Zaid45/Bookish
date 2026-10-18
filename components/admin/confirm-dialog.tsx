"use client";

import { Dialog } from "@base-ui/react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  type: "APPROVE" | "REJECT";
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  type,
  onConfirm,
  isProcessing,
}: ConfirmDialogProps) => {
  const isApprove = type === "APPROVE";

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white">
          <div className="confirm-content">
            <div
              className={cn(
                "confirm-illustration",
                isApprove ? "confirm-approve" : "confirm-reject",
              )}
            >
              <div className={isApprove ? "bg-green-200" : "bg-red-200"}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={isApprove ? "text-green-800" : "text-red-800"}
                >
                  {isApprove ? (
                    <polyline points="20 6 9 17 4 12" />
                  ) : (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  )}
                </svg>
              </div>
            </div>
            <Dialog.Title className="mt-4 text-lg font-semibold text-dark-400">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-center text-sm text-light-500">
              {description}
            </Dialog.Description>
            <div className="mt-6 flex w-full flex-col gap-3">
              <button
                className={cn(
                  "confirm-btn",
                  isApprove ? "confirm-approve" : "confirm-reject",
                )}
                onClick={onConfirm}
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : isApprove
                    ? "Approve"
                    : "Reject"}
              </button>
              <Dialog.Close className="confirm-btn bg-light-300 text-dark-400 hover:bg-light-300/80">
                Cancel
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmDialog;
