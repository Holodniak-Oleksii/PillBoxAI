import { Box, Center, Table as ChakraTable, Spinner } from "@chakra-ui/react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { TableBody } from "./TableBody";
import { TableHeader } from "./TableHeader";
import { TablePagination } from "./TablePagination";
import { TableSearch } from "./TableSearch";
import { TableProps } from "./types";

export function Table<TData>({
  data,
  columns,
  enableSorting = true,
  enablePagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  isLoading = false,
  emptyMessage,
  onRowClick,
  enableRowSelection = false,
  onSelectionChange,
  initialSorting = [],
  initialPagination = { pageIndex: 0, pageSize },
  showGlobalFilter = false,
  globalFilterPlaceholder,
}: TableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: enableSorting ? sorting : undefined,
      pagination: enablePagination ? pagination : undefined,
      globalFilter: showGlobalFilter ? globalFilter : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
    },
    onSortingChange: enableSorting ? setSorting : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
    onGlobalFilterChange: showGlobalFilter ? setGlobalFilter : undefined,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getFilteredRowModel: showGlobalFilter ? getFilteredRowModel() : undefined,
    enableRowSelection,
  });

  useEffect(() => {
    if (enableRowSelection && onSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, enableRowSelection, onSelectionChange, table]);

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box width="100%">
      {showGlobalFilter && (
        <TableSearch
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder={globalFilterPlaceholder}
        />
      )}
      <Box overflowX="auto" borderWidth="1px" borderRadius="lg">
        <ChakraTable.Root variant="outline">
          <TableHeader headerGroups={table.getHeaderGroups()} />
          <TableBody
            rows={table.getRowModel().rows}
            columnsLength={columns.length}
            emptyMessage={emptyMessage}
            onRowClick={onRowClick}
          />
        </ChakraTable.Root>
      </Box>
      {enablePagination && (
        <TablePagination
          pageIndex={table.getState().pagination.pageIndex}
          pageSize={table.getState().pagination.pageSize}
          pageCount={table.getPageCount()}
          pageSizeOptions={pageSizeOptions}
          rowSelectionCount={
            enableRowSelection ? Object.keys(rowSelection).length : undefined
          }
          totalRowCount={
            enableRowSelection
              ? table.getFilteredRowModel().rows.length
              : undefined
          }
          enableRowSelection={enableRowSelection}
          onPageChange={(index) => table.setPageIndex(index)}
          onPageSizeChange={(size) => table.setPageSize(size)}
        />
      )}
    </Box>
  );
}
