import { Table } from "@/features/Table";
import { columns } from "@/pages/Medkit/data";
import { useMedicinesByMedkitId } from "@/services/medicines/hooks";
import { IMedicines } from "@/shared/types/entities";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export const Medkit = () => {
  const { id } = useParams();
  const { data } = useMedicinesByMedkitId(id);

  return (
    <Box p={4} mt={12}>
      <Table<IMedicines> data={data ?? []} columns={columns} />
    </Box>
  );
};
