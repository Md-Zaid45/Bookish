"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const Pagination = ({
  currentPage,
  totalPages,
  variant = "light",
}: {
  currentPage: number;
  totalPages: number;
  variant?: "light" | "dark";
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  const baseBtn = variant === "dark" ? "pagination-btn_dark" : "pagination-btn_light";

  return (
    <div id="pagination" className="mt-7">
      <button
        className={baseBtn}
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={cn(
            page === currentPage
              ? variant === "dark"
                ? "bg-primary text-dark-400 hover:bg-primary"
                : "bg-primary-admin text-white hover:bg-primary-admin"
              : baseBtn,
          )}
          onClick={() => goToPage(page)}
        >
          {page}
        </button>
      ))}
      <button
        className={baseBtn}
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
