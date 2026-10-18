"use client";

import { useState } from "react";
import { Image } from "@imagekit/next";
import { Button } from "./ui/button";
import { toast } from "./ui/toast";
import { borrowBook } from "@/lib/actions/book";

interface Props {
  bookId: string;
  userId?: string;
  userStatus?: string | null;
  availableCopies: number;
}

type BorrowState = "idle" | "borrowing" | "requested";

const BorrowButton = ({ userId, bookId, userStatus, availableCopies }: Props) => {
  const [state, setState] = useState<BorrowState>("idle");

  const handleBorrow = async () => {
    if (state !== "idle") return;

    if (!userId) {
      toast.add({
        type: "error",
        title: "Not eligible",
        description: "Please sign in to borrow this book",
      });
      return;
    }

    if (userStatus !== "APPROVED") {
      toast.add({
        type: "error",
        title: "Not eligible",
        description: "Your account is not approved for borrowing",
      });
      return;
    }

    if (availableCopies <= 0) {
      toast.add({
        type: "error",
        title: "Borrow failed",
        description: "No book available",
      });
      return;
    }

    setState("borrowing");

    const result = await borrowBook({ userId, bookId });

    if (result?.success) {
      setState("requested");
      toast.add({
        type: "success",
        title: "Request submitted",
        description: "Your borrow request is pending admin approval",
      });
      return;
    }

    setState("idle");
    toast.add({
      type: "error",
      title: "Request failed",
      description: result?.error || "No book available",
    });
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrow}
      disabled={state !== "idle"}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {state === "borrowing"
          ? "Requesting..."
          : state === "requested"
            ? "Requested"
            : "Borrow"}
      </p>
    </Button>
  );
};

export default BorrowButton;
