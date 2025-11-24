import { medkitService } from "@/services/medkits";
import { IMedkit } from "@/shared/types/entities";
import { EQueryKey } from "@/shared/types/enums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMedkits = () => {
  return useQuery({
    queryKey: [EQueryKey.MEDKITS],
    queryFn: () => medkitService.getMedkits(),
  });
};

export const useMedkit = (medkitId?: string) => {
  return useQuery({
    queryKey: [EQueryKey.MEDKIT, medkitId],
    queryFn: () => medkitService.getMedkitById(medkitId as string),
  });
};

export const useCreateMedkit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (medkit: IMedkit) => medkitService.createMedkit(medkit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDKITS] });
    },
  });
};
