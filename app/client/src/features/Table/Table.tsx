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
import { memo, ReactElement, useEffect, useState } from "react";

import { TableBody } from "./TableBody";
import { TableHeader } from "./TableHeader";
import { TablePagination } from "./TablePagination";
import { TableProps } from "./types";

const TableComponent = <TData,>({
  data,
  columns,
  enableSorting = true,
  enablePagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  isLoading = false,
  emptyMessage,
  onRowClick,
  onRowDoubleClick,
  enableRowSelection = false,
  onSelectionChange,
  initialSorting = [],
  initialPagination = { pageIndex: 0, pageSize },
  showGlobalFilter = false,
}: TableProps<TData>) => {
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
      <Center>
        <Spinner size="xl" color="blackAlpha.900" />
      </Center>
    );
  }

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <Box flex="1" minH={0}>
        <ChakraTable.ScrollArea
          rounded="md"
          borderWidth="1px"
          h="100%"
          maxW="full"
        >
          <ChakraTable.Root stickyHeader interactive>
            <TableHeader headerGroups={table.getHeaderGroups()} />
            <TableBody
              rows={table.getRowModel().rows}
              columnsLength={columns.length}
              emptyMessage={emptyMessage}
              onRowClick={onRowClick}
              onRowDoubleClick={onRowDoubleClick}
            />
          </ChakraTable.Root>
        </ChakraTable.ScrollArea>
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
};

export const Table = memo(<TData,>(props: TableProps<TData>) => {
  return (
    <Box width="100%" height="100%" position="relative">
      <Box
        width="100%"
        height="100%"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
      >
        <TableComponent<TData> {...props} />
      </Box>
    </Box>
  );
}) as <TData>(props: TableProps<TData>) => ReactElement;
