import { IMedicinesFilter, medicinesService } from "@/services/medicines";
import { EQueryKey } from "@/shared/types/enums";
import { useQuery } from "@tanstack/react-query";

export const useMedicines = (
  filter?: IMedicinesFilter,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [EQueryKey.MEDICINES, filter],
    queryFn: () => medicinesService.getMedicines(filter),
    enabled,
  });
};

export const useMedicinesByMedkitId = (
  medkitId?: string,
  filter?: Omit<IMedicinesFilter, "medkitId">,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [EQueryKey.MEDICINES, "medkit", medkitId, filter],
    queryFn: () => medicinesService.getMedicinesByMedkitId(medkitId!, filter),
    enabled: enabled && !!medkitId,
  });
};

export const useMedicine = (medicineId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [EQueryKey.MEDICINES, medicineId],
    queryFn: () => medicinesService.getMedicineById(medicineId!),
    enabled: enabled && !!medicineId,
  });
};
