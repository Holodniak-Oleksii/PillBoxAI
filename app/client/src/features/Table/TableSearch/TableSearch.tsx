import { Flex, Input } from "@chakra-ui/react";

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TableSearch = ({
  value,
  onChange,
  placeholder = "Пошук...",
}: TableSearchProps) => {
  return (
    <Flex mb={4}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxW="400px"
      />
    </Flex>
  );
};
