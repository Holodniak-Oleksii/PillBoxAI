import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  enableRowSelection?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  initialSorting?: SortingState;
  initialPagination?: PaginationState;
  showGlobalFilter?: boolean;
  globalFilterPlaceholder?: string;
}

export interface TableState {
  sorting: SortingState;
  pagination: PaginationState;
  globalFilter: string;
  rowSelection: Record<string, boolean>;
}
