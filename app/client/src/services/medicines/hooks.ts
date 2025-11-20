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
  medkitId?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [EQueryKey.MEDICINES, "medkit", medkitId],
    queryFn: () => medicinesService.getMedicinesByMedkitId(medkitId!),
    enabled: enabled && !!medkitId,
  });
};

export const useMedicine = (medicineId?: number, enabled: boolean = true) => {
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
      medkitId: number;
      createdById: number;
      pill: IPillRequest;
    }) => medicinesService.createMedicine(medkitId, createdById, pill),
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
      medicineId: number;
      pill: IPillRequest;
    }) => medicinesService.updateMedicine(medicineId, pill),
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
    mutationFn: (medicineId: number) =>
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
      medicineId: number;
      quantity: number;
    }) => medicinesService.takeMedicine(medicineId, quantity),
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
      medicineId: number;
      quantity: number;
    }) => medicinesService.addMedicineQuantity(medicineId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDICINES] });
      queryClient.invalidateQueries({
        queryKey: [EQueryKey.MEDICINES, variables.medicineId],
      });
    },
  });
};
