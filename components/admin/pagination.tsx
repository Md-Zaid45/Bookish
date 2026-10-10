"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const Pagination = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div id="pagination" className="mt-7">
      <button
        className="pagination-btn_light"
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
              ? "bg-primary-admin text-white hover:bg-primary-admin"
              : "pagination-btn_light",
          )}
          onClick={() => goToPage(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="pagination-btn_light"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
