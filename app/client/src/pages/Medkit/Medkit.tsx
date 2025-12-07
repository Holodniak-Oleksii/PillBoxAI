import { PATHS } from "@/app/router/paths";
import { useUserStore } from "@/app/store/user";
import { FilterCreator } from "@/features/FilterCreator";
import { Table } from "@/features/Table";
import { ActionHeader } from "@/pages/Medkit/ActionHeader";
import {
  useDeleteMedicine,
  useMedicinesByMedkitId,
} from "@/services/medicines/hooks";
import { useMedkit, useMedkitMembers } from "@/services/medkits/hooks";
import { IMedicines } from "@/shared/types/entities";
import { EModalKey, ETableName } from "@/shared/types/enums";
import { canEdit, getUserRole } from "@/shared/utils/medkitPermissions";
import {
  AbsoluteCenter,
  Flex,
  HStack,
  Separator,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const user = useUserStore((state) => state.user);

  const {
    data: medkit,
    isLoading: isLoadingMedkit,
    isError: isErrorMedkit,
  } = useMedkit(id);
  const { data: members } = useMedkitMembers(id);
  const { mutateAsync: deleteMedicine } = useDeleteMedicine();
  const { data: medicines, isLoading: isLoadingMedicines } =
    useMedicinesByMedkitId(id);
  const { show: showCreateMedicine } = useModal(EModalKey.CREATE_MEDICINE);

  const [filteredMedicines, setFilteredMedicines] = useState<IMedicines[]>(
    medicines || []
  );

  // Get current user's role in this medkit
  const currentUserMember = useMemo(() => {
    if (!user) return undefined;
    // Check if user is owner (from medkit.ownerId)
    if (medkit?.ownerId === user.id) {
      return {
        id: -1,
        medkitId: medkit.id,
        userId: user.id,
        role: "OWNER" as const,
        addedAt: medkit.createdAt,
      };
    }
    // Check if user is in members list
    return getUserRole(members, user.id);
  }, [user, medkit, members]);

  const userCanEdit = canEdit(currentUserMember);

  const handleEditMedicine = useCallback(
    (medicine: IMedicines) => {
      if (!userCanEdit) return;
      showCreateMedicine({
        medicine,
        medkitId: id,
      });
    },
    [id, userCanEdit, showCreateMedicine]
  );

  const handleDeleteMedicine = useCallback(
    (medicine: IMedicines) => {
      if (!userCanEdit) return;
      deleteMedicine(medicine.id);
    },
    [userCanEdit, deleteMedicine]
  );

  const handleMedicineDoubleClick = useCallback(
    (medicine: IMedicines) => {
      if (id) {
        navigate(PATHS.MEDICINE(id, medicine.id));
      }
    },
    [id, navigate]
  );

  const handleFilterSubmit = useCallback(
    (values: IMedicinesFilterValues) => {
      const { search } = values;
      const filtered = medicines?.filter((medicine) =>
        medicine.name.toLowerCase().includes(search?.toLowerCase() || "")
      );
      setFilteredMedicines(filtered || []);
    },
    [medicines]
  );

  const filterConfig = useMemo(() => getFilterConfig(t), [t]);
  const columns = useMemo(
    () => getColumns(t, handleEditMedicine, handleDeleteMedicine, userCanEdit),
    [t, handleEditMedicine, handleDeleteMedicine, userCanEdit]
  );

  useEffect(() => {
    setFilteredMedicines(medicines || []);
  }, [medicines]);

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
        data={filteredMedicines}
        columns={columns}
        isLoading={isLoadingMedicines}
        onRowDoubleClick={handleMedicineDoubleClick}
      />
    </Flex>
  );
};
