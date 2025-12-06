/* eslint-disable react-hooks/exhaustive-deps */
import { PATHS } from "@/app/router/paths";
import { FilterCreator } from "@/features/FilterCreator";
import { Table } from "@/features/Table";
import { ActionHeader } from "@/pages/Medkit/ActionHeader";
import {
  useDeleteMedicine,
  useMedicinesByMedkitId,
} from "@/services/medicines/hooks";
import { useMedkit } from "@/services/medkits/hooks";
import { IMedicines } from "@/shared/types/entities";
import { EModalKey, ETableName } from "@/shared/types/enums";
import {
  AbsoluteCenter,
  Flex,
  HStack,
  Separator,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getColumns, getFilterConfig } from "./data";

interface IMedicinesFilterValues extends Record<string, unknown> {
  search?: string;
}

export const Medkit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: medkit,
    isLoading: isLoadingMedkit,
    isError: isErrorMedkit,
  } = useMedkit(id);
  const { mutateAsync: deleteMedicine } = useDeleteMedicine();
  const { data: medicines, isLoading: isLoadingMedicines } =
    useMedicinesByMedkitId(id);
  const { show: showCreateMedicine } = useModal(EModalKey.CREATE_MEDICINE);

  const handleEditMedicine = useCallback(
    (medicine: IMedicines) => {
      showCreateMedicine({
        medicine,
        medkitId: id,
      });
    },
    [id]
  );

  const handleDeleteMedicine = useCallback((medicine: IMedicines) => {
    deleteMedicine(medicine.id);
  }, []);

  const handleMedicineDoubleClick = useCallback(
    (medicine: IMedicines) => {
      if (id) {
        navigate(PATHS.MEDICINE(id, medicine.id));
      }
    },
    [id]
  );

  const handleFilterSubmit = useCallback((values: IMedicinesFilterValues) => {
    console.log(values);
  }, []);

  const filterConfig = useMemo(() => getFilterConfig(t), []);
  const columns = useMemo(
    () => getColumns(t, handleEditMedicine, handleDeleteMedicine),
    []
  );

  if (isErrorMedkit) {
    return <Navigate to={PATHS.HOME} />;
  }

  if (isLoadingMedkit || !medkit) {
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
        <ActionHeader medkit={medkit} />
      </HStack>
      {!!medkit?.description && <Text>{medkit.description}</Text>}
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
