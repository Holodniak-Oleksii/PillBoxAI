import { Table as ChakraTable, Text } from "@chakra-ui/react";
import { flexRender, Row } from "@tanstack/react-table";

interface TableBodyProps<TData> {
  rows: Row<TData>[];
  columnsLength: number;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
}

export function TableBody<TData>({
  rows,
  columnsLength,
  emptyMessage = "Немає даних для відображення",
  onRowClick,
}: TableBodyProps<TData>) {
  if (rows.length === 0) {
    return (
      <ChakraTable.Body>
        <ChakraTable.Row>
          <ChakraTable.Cell colSpan={columnsLength} textAlign="center" py={8}>
            <Text color="gray.500">{emptyMessage}</Text>
          </ChakraTable.Cell>
        </ChakraTable.Row>
      </ChakraTable.Body>
    );
  }

  return (
    <ChakraTable.Body>
      {rows.map((row) => (
        <ChakraTable.Row
          key={row.id}
          onClick={() => onRowClick?.(row.original)}
          cursor={onRowClick ? "pointer" : "default"}
          _hover={onRowClick ? { bg: "gray.50" } : undefined}
        >
          {row.getVisibleCells().map((cell) => (
            <ChakraTable.Cell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </ChakraTable.Cell>
          ))}
        </ChakraTable.Row>
      ))}
    </ChakraTable.Body>
  );
}
