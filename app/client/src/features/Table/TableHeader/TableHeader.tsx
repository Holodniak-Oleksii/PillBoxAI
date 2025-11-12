import { Box, Table as ChakraTable, Flex } from "@chakra-ui/react";
import { flexRender, Header, HeaderGroup } from "@tanstack/react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

interface TableHeaderProps<TData> {
  headerGroups: HeaderGroup<TData>[];
}

export function TableHeader<TData>({ headerGroups }: TableHeaderProps<TData>) {
  const renderSortIcon = (header: Header<TData, unknown>) => {
    const isSorted = header.column.getIsSorted();

    if (isSorted === "asc") {
      return <FaSortUp />;
    }
    if (isSorted === "desc") {
      return <FaSortDown />;
    }
    return <FaSort />;
  };

  return (
    <ChakraTable.Header>
      {headerGroups.map((headerGroup) => (
        <ChakraTable.Row key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();

            return (
              <ChakraTable.ColumnHeader
                key={header.id}
                onClick={
                  canSort ? header.column.getToggleSortingHandler() : undefined
                }
                cursor={canSort ? "pointer" : "default"}
                userSelect={canSort ? "none" : "auto"}
                _hover={canSort ? { bg: "gray.100" } : undefined}
              >
                <Flex align="center" gap={2}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {canSort && (
                    <Box color="gray.500">{renderSortIcon(header)}</Box>
                  )}
                </Flex>
              </ChakraTable.ColumnHeader>
            );
          })}
        </ChakraTable.Row>
      ))}
    </ChakraTable.Header>
  );
}
