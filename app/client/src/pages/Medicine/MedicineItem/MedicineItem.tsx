import { IMedicines } from "@/shared/types/entities";
import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface IMedicineItemProps {
  fieldKey: keyof IMedicines;
  value?: string | number;
  unit?: string;
  isBox?: boolean;
}

export const MedicineItem: FC<IMedicineItemProps> = (props) => {
  const { fieldKey, value, unit, isBox } = props;

  const { t } = useTranslation();

  if (!value || !fieldKey) return null;

  if (isBox) {
    return (
      <Box bg="gray.50" p={4} borderRadius="md" borderWidth="1px">
        <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">
          {t(`medicine.${fieldKey}`)}
        </Text>
        <Text fontSize="2xl" fontWeight="semibold">
          {value} {unit}
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="md" fontWeight="semibold">
        {t(`medicine.${fieldKey}`)}
      </Text>
      <Text fontSize="md" fontWeight="medium" whiteSpace="pre-wrap">
        {value}
      </Text>
    </Box>
  );
};
