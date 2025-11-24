import {
  ButtonGroup,
  createListCollection,
  Flex,
  HStack,
  IconButton,
  Pagination,
  Portal,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Text,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  pageSizeOptions: number[];
  rowSelectionCount?: number;
  totalRowCount?: number;
  enableRowSelection?: boolean;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const TablePagination = ({
  pageIndex,
  pageSize,
  pageCount,
  pageSizeOptions,
  rowSelectionCount,
  totalRowCount,
  enableRowSelection,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) => {
  if (pageCount === 0) {
    return null;
  }

  const currentPage = pageIndex + 1;
  const count = totalRowCount || pageCount * pageSize;

  return (
    <Flex mt={4} justify="space-between" align="center" flexWrap="wrap" gap={4}>
      <Pagination.Root
        count={count}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={(details) => onPageChange(details.page - 1)}
      >
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton aria-label="Previous page">
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton aria-label="Next page">
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>

      <HStack gap={3}>
        {enableRowSelection &&
          rowSelectionCount !== undefined &&
          totalRowCount !== undefined && (
            <Text fontSize="sm" color="gray.600">
              Вибрано: <strong>{rowSelectionCount}</strong> з{" "}
              <strong>{totalRowCount}</strong>
            </Text>
          )}

        <HStack gap={2}>
          <Text fontSize="sm" color="gray.600">
            Page
          </Text>
          <SelectRoot
            size="sm"
            value={[String(pageSize)]}
            onValueChange={(e) => onPageSizeChange(Number(e.value[0]))}
            collection={createListCollection({
              items: pageSizeOptions.map((size) => ({
                label: String(size),
                value: String(size),
              })),
            })}
            width="80px"
          >
            <SelectTrigger>
              <SelectValueText />
            </SelectTrigger>
            <Portal>
              <SelectPositioner>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} item={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectPositioner>
            </Portal>
          </SelectRoot>
          <Text fontSize="sm" color="gray.600">
            of {pageCount}
          </Text>
        </HStack>
      </HStack>
    </Flex>
  );
};
