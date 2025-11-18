import { FilterCreator } from "@/features/FilterCreator";
import { Table } from "@/features/Table";
import { useMedicinesByMedkitId } from "@/services/medicines/hooks";
import { useMedkit } from "@/services/medkits/hooks";
import { IMedicines } from "@/shared/types/entities";
import { ETableName } from "@/shared/types/enums";
import {
  AbsoluteCenter,
  Flex,
  Separator,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { columns, filterConfig } from "./data";

interface IMedicinesFilterValues extends Record<string, unknown> {
  search?: string;
  quantity?: number;
  expiryDate?: {
    startDate?: string | Date;
    endDate?: string | Date;
  } | null;
}

export const Medkit = () => {
  const { id } = useParams();
  const { data: medkit, isLoading: isLoadingMedkit } = useMedkit(id);
  const { data: medicines, isLoading: isLoadingMedicines } =
    useMedicinesByMedkitId(id);

  const handleFilterSubmit = (values: IMedicinesFilterValues) => {
    console.log("values :", values);
  };

  if (isLoadingMedkit) {
    return (
      <AbsoluteCenter>
        <Spinner size="xl" color="blackAlpha.900" />
      </AbsoluteCenter>
    );
  }

  return (
    <Flex p={4} flexDirection="column" h={"100%"} w={"100%"}>
      <Text fontSize="2xl" fontWeight="bold" lineHeight={1}>
        {medkit?.name}
      </Text>
      <Separator my={4} />
      <FilterCreator<IMedicinesFilterValues>
        tableName={ETableName.MEDICINES}
        config={filterConfig}
        onSubmit={handleFilterSubmit}
      />
      <Table<IMedicines>
        data={medicines || []}
        columns={columns}
        isLoading={isLoadingMedicines}
      />
    </Flex>
  );
};
