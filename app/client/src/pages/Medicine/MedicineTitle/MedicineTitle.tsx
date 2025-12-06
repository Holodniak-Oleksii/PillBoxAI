import { IMedicines } from "@/shared/types/entities";
import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useExpiredTime } from "./hooks";

interface IMedicineTitleProps {
  medicine: IMedicines;
}
export const MedicineTitle: FC<IMedicineTitleProps> = (props) => {
  const { medicine } = props;

  const { t } = useTranslation();
  const { isExpired, isExpiringSoon } = useExpiredTime(medicine.expiryDate);

  const borderColor = isExpired
    ? "red.400"
    : isExpiringSoon
    ? "orange.400"
    : "gray.200";

  return (
    <Box
      borderLeft="4px"
      borderStyle="solid"
      borderColor={borderColor}
      pl={3}
      mt={4}
    >
      <Flex alignItems="center" gap={3} mb={2}>
        <Text fontSize="3xl" fontWeight="bold" lineHeight={1}>
          {medicine.name}
        </Text>
        {isExpired && (
          <Badge bg="red.400" size="lg">
            {t("medicine.expired")}
          </Badge>
        )}
        {!isExpired && isExpiringSoon && (
          <Badge bg="orange.400" size="lg">
            {t("medicine.expiringSoon")}
          </Badge>
        )}
      </Flex>

      {medicine.activeSubstance && (
        <Text fontSize="lg" color="gray.600">
          {medicine.activeSubstance}
        </Text>
      )}
    </Box>
  );
};
