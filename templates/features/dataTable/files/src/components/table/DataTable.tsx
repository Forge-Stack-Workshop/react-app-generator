import type { ReactNode } from "react";
import { useTableState } from "./useTableState";
import styles from "./DataTable.module.scss";

export type Column<T> = {
  key: keyof T & string;
  header: string;
  render?: (row: T) => ReactNode;
};

export interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  pageSize?: number;
}

// Generic, dependency-free data table: hand-rolled client sort + pagination
// via useTableState. Works with any row shape T — callers supply columns and
// an optional custom `render` per column.
export function DataTable<T>({ rows, columns, pageSize }: DataTableProps<T>) {
  const { page, setPage, pageCount, sortKey, sortDir, toggleSort, visibleRows } =
    useTableState(rows, { pageSize });

  if (rows.length === 0) {
    return <p className={styles.empty}>No data to display.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                <button
                  type="button"
                  className={styles.sortButton}
                  onClick={() => toggleSort(col.key)}
                >
                  {col.header}
                  {sortKey === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={page <= 0}
        >
          Prev
        </button>
        <span>
          {page + 1} / {pageCount}
        </span>
        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={page >= pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
