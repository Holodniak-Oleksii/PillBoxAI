import { Table } from "@/features/Table";
import { columns } from "@/pages/Medkit/data";
import { useMedicinesByMedkitId } from "@/services/medicines/hooks";
import { useMedkit } from "@/services/medkits/hooks";
import { IMedicines } from "@/shared/types/entities";
import {
  AbsoluteCenter,
  Flex,
  Separator,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export const Medkit = () => {
  const { id } = useParams();
  const { data: medkit, isLoading: isLoadingMedkit } = useMedkit(id);
  const { data: medicines, isLoading: isLoadingMedicines } =
    useMedicinesByMedkitId(id);

  if (isLoadingMedkit) {
    return (
      <AbsoluteCenter>
        <Spinner size="xl" color="blackAlpha.900" />
      </AbsoluteCenter>
    );
  }

  return (
    <Flex p={4} flexDirection="column" gap={4} h={"100%"} w={"100%"}>
      <Text fontSize="2xl" fontWeight="bold" lineHeight={1}>
        {medkit?.name}
      </Text>
      <Separator />
      <Table<IMedicines>
        data={medicines ?? []}
        columns={columns}
        isLoading={isLoadingMedicines}
      />
    </Flex>
  );
};
