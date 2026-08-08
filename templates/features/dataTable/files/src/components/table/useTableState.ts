import { useMemo, useState } from "react";

export type SortDir = "asc" | "desc";

export interface UseTableStateOptions {
  pageSize?: number;
}

export interface UseTableState<T> {
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
  sortKey: (keyof T & string) | null;
  sortDir: SortDir;
  toggleSort: (key: keyof T & string) => void;
  visibleRows: T[];
}

const DEFAULT_PAGE_SIZE = 10;

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return String(a).localeCompare(String(b));
}

function sortRows<T>(
  rows: T[],
  sortKey: (keyof T & string) | null,
  sortDir: SortDir,
): T[] {
  if (!sortKey) return rows;
  const sorted = [...rows].sort((a, b) => compareValues(a[sortKey], b[sortKey]));
  return sortDir === "asc" ? sorted : sorted.reverse();
}

// Pure client-side sort + pagination state for DataTable. No effects: sorting
// and slicing are derived with useMemo from `rows`, `page`, `sortKey`, and
// `sortDir` — the source of truth stays in this hook's own useState calls.
export function useTableState<T>(
  rows: T[],
  opts?: UseTableStateOptions,
): UseTableState<T> {
  const pageSize = opts?.pageSize ?? DEFAULT_PAGE_SIZE;
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<(keyof T & string) | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sortedRows = useMemo(
    () => sortRows(rows, sortKey, sortDir),
    [rows, sortKey, sortDir],
  );

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);

  const visibleRows = useMemo(() => {
    const start = currentPage * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  function toggleSort(key: keyof T & string): void {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      setPage(0);
      return;
    }
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  return {
    page: currentPage,
    setPage,
    pageCount,
    sortKey,
    sortDir,
    toggleSort,
    visibleRows,
  };
}
