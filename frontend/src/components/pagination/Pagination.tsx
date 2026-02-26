import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    if (currentPage <= 3) {
      for (let i = 0; i < Math.min(5, totalPages); i++) {
        pages.push(i);
      }
      if (totalPages > 5) {
        pages.push('...');
        pages.push(totalPages - 1);
      }
    } else if (currentPage >= totalPages - 3) {
      pages.push(0);
      pages.push('...');
      for (let i = totalPages - 5; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages - 1);
    }
  } else {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`h-10 min-w-[2.5rem] rounded-lg border px-3 text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-[oklch(0.55_0.22_280)] text-white'
                : 'bg-background hover:bg-muted'
            }`}
          >
            {(page as number) + 1}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
