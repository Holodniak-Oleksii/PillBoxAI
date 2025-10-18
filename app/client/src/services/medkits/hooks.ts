import { medkitService } from "@/services/medkits";
import { EQueryKey } from "@/shared/types/enums";
import { useQuery } from "@tanstack/react-query";

export const useMedkits = () => {
  return useQuery({
    queryKey: [EQueryKey.MEDKITS],
    queryFn: () => medkitService.getMedkits(),
  });
};

export const useMedkit = (medkitId: string) => {
  return useQuery({
    queryKey: [EQueryKey.MEDKIT, medkitId],
    queryFn: () => medkitService.getMedkitById(medkitId),
  });
};
