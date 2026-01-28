import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { PaginationResponseMeta } from "../types/posts-query.types";

type PaginationProps = {
  pagination: PaginationResponseMeta;
};

const Pagination = ({ pagination }: PaginationProps) => {
  const { totalItems, itemsPerPage, currentPage, totalPages } = pagination;

  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const visiblePages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const navigate = useNavigate();

  const handlePrevPage = () => {
    if (isFirstPage) return;

    navigate(`?page=${currentPage - 1}&limit=${itemsPerPage}`);
  };

  const handleNextPage = () => {
    if (isLastPage) return;

    navigate(`?page=${currentPage + 1}&limit=${itemsPerPage}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-400">
        Showing <span className="font-semibold">{firstItem}</span>-
        <span className="font-semibold">{lastItem}</span> of{" "}
        <span className="font-semibold">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={isFirstPage}
          className={`rounded-full border border-gray-400 p-2 hover:bg-(--text-clr)/15 ${
            isFirstPage ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          <ChevronLeftIcon size={16} />
        </button>

        {visiblePages.map((page) => (
          <Link
            key={page}
            to={`?page=${page}&limit=${itemsPerPage}`}
            className={`rounded-full py-1 px-2.5 text-sm
              ${
                page === currentPage
                  ? "bg-(--text-clr) text-(--bg-clr) hover:brightness-90"
                  : "border border-gray-400 hover:bg-(--text-clr)/15"
              }`}
          >
            {page}
          </Link>
        ))}

        <button
          type="button"
          onClick={handleNextPage}
          disabled={isLastPage}
          className={`rounded-full border border-gray-400 p-2 hover:bg-(--text-clr)/15 ${
            isLastPage ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
