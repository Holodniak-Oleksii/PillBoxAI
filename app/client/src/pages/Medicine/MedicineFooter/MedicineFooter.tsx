import { formatDate } from "@/helpers/date";
import { IMedicines } from "@/shared/types/entities";
import { Box, Flex, Separator, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface IMedicineFooterProps {
  medicine: IMedicines;
}

export const MedicineFooter: FC<IMedicineFooterProps> = (props) => {
  const { medicine } = props;

  const { t } = useTranslation();

  return (
    <Box mt="auto" pt={4}>
      <Separator mb={4} />
      <Flex gap={4}>
        <Flex gap={4}>
          <Box>
            <Text fontWeight="bold" fontSize="sm" color="gray.600">
              {t("common.createdAt")}
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {formatDate(new Date(medicine.createdAt))}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="sm" color="gray.600">
              {t("common.updatedAt")}
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {formatDate(new Date(medicine.updatedAt))}
            </Text>
          </Box>
        </Flex>
        {medicine.createdByUsername && (
          <Box ml="auto">
            <Text fontWeight="bold" fontSize="sm" color="gray.600">
              {t("common.createdBy")}
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {medicine.createdByUsername}
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
