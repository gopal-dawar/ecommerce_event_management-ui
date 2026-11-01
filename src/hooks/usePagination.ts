import { useCallback, useState } from "react";

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination(options: PaginationOptions = {}) {
  const [pageNumber, setPageNumber] = useState<number>(options.initialPage ?? 1);
  const [pageSize, setPageSize] = useState<number>(options.initialPageSize ?? 10);

  const onPageChange = useCallback((newPage: number) => {
    setPageNumber(newPage);
  }, []);

  const onPageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPageNumber(1); // Reset to first page when changing page size
  }, []);

  return {
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
    onPageChange,
    onPageSizeChange,
  };
}
