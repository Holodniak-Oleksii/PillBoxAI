import { PATHS } from "@/app/router/paths";
import { FilterCreator } from "@/features/FilterCreator";
import { Table } from "@/features/Table";
import { useMedicinesByMedkitId } from "@/services/medicines/hooks";
import { useMedkit } from "@/services/medkits/hooks";
import { IMedicines } from "@/shared/types/entities";
import { EModalKey, ETableName } from "@/shared/types/enums";
import {
  AbsoluteCenter,
  Button,
  Flex,
  HStack,
  Separator,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LuPlus } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { getColumns, getFilterConfig } from "./data";

interface IMedicinesFilterValues extends Record<string, unknown> {
  search?: string;
  quantity?: number;
  expiryDate?: {
    startDate?: string | Date;
    endDate?: string | Date;
  } | null;
}

export const Medkit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: medkit, isLoading: isLoadingMedkit } = useMedkit(id);
  const { data: medicines, isLoading: isLoadingMedicines } =
    useMedicinesByMedkitId(id);
  const { show } = useModal(EModalKey.CREATE_MEDICINE);

  const handleFilterSubmit = (values: IMedicinesFilterValues) => {
    console.log("values :", values);
  };

  const handleCreateMedicine = () => {
    show({
      medkitId: id,
      onSuccess: (medicine: IMedicines) => {
        console.log("Medicine created:", medicine);
      },
    });
  };

  const handleEditMedicine = useCallback(
    (medicine: IMedicines) => {
      show({
        medicine,
        medkitId: id,
        onSuccess: (updatedMedicine: IMedicines) => {
          console.log("Medicine updated:", updatedMedicine);
          // TODO: Refetch medicines or update cache
        },
      });
    },
    [id, show]
  );

  const handleDeleteMedicine = useCallback((medicine: IMedicines) => {
    // TODO: Add confirmation dialog
    console.log("Delete medicine:", medicine);
    // TODO: Implement delete API call
  }, []);

  const handleMedicineDoubleClick = useCallback(
    (medicine: IMedicines) => {
      if (id) {
        navigate(PATHS.MEDICINE(id, medicine.id));
      }
    },
    [id, navigate]
  );

  const columns = useMemo(
    () => getColumns(t, handleEditMedicine, handleDeleteMedicine),
    [t, handleEditMedicine, handleDeleteMedicine]
  );

  const filterConfig = useMemo(() => getFilterConfig(t), [t]);

  if (isLoadingMedkit) {
    return (
      <AbsoluteCenter>
        <Spinner size="xl" color="blackAlpha.900" />
      </AbsoluteCenter>
    );
  }

  return (
    <Flex p={4} flexDirection="column" gap={4} h={"100%"} w={"100%"}>
      <HStack justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold" lineHeight={1}>
          {medkit?.name}
        </Text>
        <Button
          onClick={handleCreateMedicine}
          colorPalette="blue"
          size="md"
          variant="solid"
        >
          <LuPlus />
          {t("medkit.addMedicine")}
        </Button>
      </HStack>

      <Separator />

      <FilterCreator<IMedicinesFilterValues>
        tableName={ETableName.MEDICINES}
        config={filterConfig}
        onSubmit={handleFilterSubmit}
      />

      <Table<IMedicines>
        data={medicines || []}
        columns={columns}
        isLoading={isLoadingMedicines}
        onRowDoubleClick={handleMedicineDoubleClick}
      />
    </Flex>
  );
};
