import { useState, useCallback } from 'react';

export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);

  const next = useCallback(() => setPage((p) => Math.min(p + 1, totalPages)), [totalPages]);
  const prev = useCallback(() => setPage((p) => Math.max(p - 1, 1)), []);
  const goTo = useCallback((p) => setPage(Math.max(1, Math.min(p, totalPages))), [totalPages]);

  return { page, limit, totalPages, setTotalPages, setLimit, next, prev, goTo };
}
