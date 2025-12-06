import { PATHS } from "@/app/router/paths";
import { formatDate } from "@/helpers/date";
import { MedicineFooter } from "@/pages/Medicine/MedicineFooter";
import { MedicineItem } from "@/pages/Medicine/MedicineItem";
import { MedicineTitle } from "@/pages/Medicine/MedicineTitle";
import { useMedicine } from "@/services/medicines/hooks";
import { useMedkit } from "@/services/medkits/hooks";
import { AbsoluteCenter, Flex, Grid, Spinner, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { MEDICINE_ITEMS } from "./constants";
import { MedicineHeader } from "./MedicineHeader";

export const Medicine = () => {
  const { t } = useTranslation();
  const { medkitId, medicineId } = useParams();
  const { data: medicine, isLoading: isLoadingMedicine } =
    useMedicine(medicineId);
  const { data: medkit, isLoading: isLoadingMedkit } = useMedkit(medkitId);

  if (isLoadingMedicine || isLoadingMedkit) {
    return (
      <AbsoluteCenter>
        <Spinner size="xl" color="blackAlpha.900" />
      </AbsoluteCenter>
    );
  }

  if (!medicine) {
    return <Navigate to={PATHS.MEDKIT(medkitId)} />;
  }

  const renderItems = () => {
    return MEDICINE_ITEMS.map((item) => {
      return <MedicineItem key={item} fieldKey={item} value={medicine[item]} />;
    });
  };

  return (
    <Flex
      p={4}
      flexDirection="column"
      gap={2}
      h="100%"
      w="100%"
      overflow="auto"
    >
      <MedicineHeader medicine={medicine} medkit={medkit} />
      <MedicineTitle medicine={medicine} />

      <Text fontSize="xl" fontWeight="bold" mt={4} ml={4}>
        {t("medicine.details")}
      </Text>

      <Grid templateColumns={"repeat(2, 1fr)"} gap={4}>
        <MedicineItem
          fieldKey="quantity"
          value={medicine.quantity}
          unit={t("medicine.units")}
          isBox
        />
        <MedicineItem
          fieldKey="expiryDate"
          value={formatDate(new Date(medicine.expiryDate))}
          isBox
        />
      </Grid>

      <Flex flexDirection="column" gap={4} px={4} mt={4}>
        {renderItems()}
      </Flex>
      <MedicineFooter medicine={medicine} />
    </Flex>
  );
};
