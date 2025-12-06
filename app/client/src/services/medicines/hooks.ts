import { medicinesService } from "@/services/medicines";
import { IPillRequest } from "@/shared/types/entities";
import { EQueryKey } from "@/shared/types/enums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Medicines queries
export const useMedicines = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [EQueryKey.MEDICINES],
    queryFn: () => medicinesService.getMedicines(),
    enabled,
  });
};

export const useMedicinesByMedkitId = (
  medkitId?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [EQueryKey.MEDICINES, "medkit", medkitId],
    queryFn: () => medicinesService.getMedicinesByMedkitId(medkitId!),
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

export const useSearchMedicines = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [EQueryKey.MEDICINES, "search", name],
    queryFn: () => medicinesService.searchMedicines(name),
    enabled: enabled && name.length > 0,
  });
};

// Medicines mutations
export const useCreateMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      medkitId,
      createdById,
      pill,
    }: {
      medkitId: number | string;
      createdById: number;
      pill: IPillRequest;
    }) => medicinesService.createMedicine(String(medkitId), createdById, pill),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDICINES] });
      queryClient.invalidateQueries({
        queryKey: [EQueryKey.MEDICINES, "medkit", variables.medkitId],
      });
    },
  });
};

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      medicineId,
      pill,
    }: {
      medicineId: number | string;
      pill: IPillRequest;
    }) => medicinesService.updateMedicine(String(medicineId), pill),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDICINES] });
      queryClient.invalidateQueries({
        queryKey: [EQueryKey.MEDICINES, variables.medicineId],
      });
    },
  });
};

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (medicineId: string | number) =>
      medicinesService.deleteMedicine(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDICINES] });
    },
  });
};

export const useTakeMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      medicineId,
      quantity,
    }: {
      medicineId: number | string;
      quantity: number;
    }) => medicinesService.takeMedicine(String(medicineId), quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDICINES] });
      queryClient.invalidateQueries({
        queryKey: [EQueryKey.MEDICINES, variables.medicineId],
      });
    },
  });
};

export const useAddMedicineQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      medicineId,
      quantity,
    }: {
      medicineId: number | string;
      quantity: number;
    }) => medicinesService.addMedicineQuantity(String(medicineId), quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDICINES] });
      queryClient.invalidateQueries({
        queryKey: [EQueryKey.MEDICINES, variables.medicineId],
      });
    },
  });
};
