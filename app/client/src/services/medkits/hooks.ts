import { medkitService } from "@/services/medkits";
import { IMedkitRequest, MedkitMemberRole } from "@/shared/types/entities";
import { EQueryKey } from "@/shared/types/enums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Medkit queries
export const useMedkits = () => {
  return useQuery({
    queryKey: [EQueryKey.MEDKITS],
    queryFn: () => medkitService.getMedkits(),
  });
};

export const useMedkit = (medkitId?: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [EQueryKey.MEDKIT, medkitId],
    queryFn: () => medkitService.getMedkitById(medkitId!),
    enabled: enabled && !!medkitId,
  });
};

export const useMedkitsByOwner = (
  ownerId?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [EQueryKey.MEDKITS, "owner", ownerId],
    queryFn: () => medkitService.getMedkitsByOwnerId(ownerId!),
    enabled: enabled && !!ownerId,
  });
};

export const useSearchMedkits = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [EQueryKey.MEDKITS, "search", name],
    queryFn: () => medkitService.searchMedkits(name),
    enabled: enabled && name.length > 0,
  });
};

// Medkit mutations
export const useCreateMedkit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ownerId,
      medkit,
    }: {
      ownerId: number;
      medkit: IMedkitRequest;
    }) => medkitService.createMedkit(ownerId, medkit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDKITS] });
    },
  });
};

export const useUpdateMedkit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      medkitId,
      medkit,
    }: {
      medkitId: number;
      medkit: IMedkitRequest;
    }) => medkitService.updateMedkit(medkitId, medkit),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDKITS] });
      queryClient.invalidateQueries({
        queryKey: [EQueryKey.MEDKIT, variables.medkitId],
      });
    },
  });
};

export const useDeleteMedkit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (medkitId: number) => medkitService.deleteMedkit(medkitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDKITS] });
    },
  });
};

// Medkit members queries
export const useMedkitMembers = (
  medkitId?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [EQueryKey.MEDKIT, medkitId, "members"],
    queryFn: () => medkitService.getMedkitMembers(medkitId!),
    enabled: enabled && !!medkitId,
  });
};

export const useUserMedkits = (userId?: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [EQueryKey.MEDKITS, "user", userId],
    queryFn: () => medkitService.getUserMedkits(userId!),
    enabled: enabled && !!userId,
  });
};

export const useMedkitMember = (
  medkitId?: number,
  userId?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [EQueryKey.MEDKIT, medkitId, "member", userId],
    queryFn: () => medkitService.getMedkitMember(medkitId!, userId!),
    enabled: enabled && !!medkitId && !!userId,
  });
};

// Medkit members mutations
export const useAddMedkitMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      medkitId,
      memberData,
    }: {
      medkitId: number;
      memberData: { userId: number; role: MedkitMemberRole };
    }) => medkitService.addMedkitMember(medkitId, memberData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [EQueryKey.MEDKIT, variables.medkitId, "members"],
      });
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: number;
      role: MedkitMemberRole;
    }) => medkitService.updateMemberRole(memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDKIT] });
    },
  });
};

export const useRemoveMedkitMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) =>
      medkitService.removeMedkitMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDKIT] });
    },
  });
};
