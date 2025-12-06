import { useUserStore } from "@/app/store/user";
import { medkitService } from "@/services/medkits";
import {
  IMedkitMemberRequest,
  IMedkitRequest,
  MedkitMemberRole,
} from "@/shared/types/entities";
import { EQueryKey } from "@/shared/types/enums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Medkit queries
export const useMedkits = () => {
  return useQuery({
    queryKey: [EQueryKey.MEDKITS],
    queryFn: () => medkitService.getMedkits(),
  });
};

export const useMedkit = (medkitId?: string, enabled: boolean = true) => {
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
    enabled: enabled,
  });
};

export const useCreateMedkit = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  return useMutation({
    mutationFn: (medkit: IMedkitRequest) =>
      medkitService.createMedkit(medkit, user?.id),
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
      medkitId?: number;
      medkit: IMedkitRequest;
    }) => medkitService.updateMedkit(medkit, medkitId),
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
    mutationFn: (medkitId: number | string) =>
      medkitService.deleteMedkit(medkitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDKITS] });
    },
  });
};

// Medkit members queries
export const useMedkitMembers = (
  medkitId?: number | string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [EQueryKey.MEDKIT, medkitId, "members"],
    queryFn: () => medkitService.getMedkitMembers(medkitId!),
    enabled: enabled && !!medkitId,
  });
};

export const useUserMedkits = (
  userId?: number | string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [EQueryKey.MEDKITS, "user", userId],
    queryFn: () => medkitService.getUserMedkits(userId!),
    enabled: enabled && !!userId,
  });
};

export const useMedkitMember = (
  medkitId?: number | string,
  userId?: number | string,
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
      medkitId: number | string;
      memberData: IMedkitMemberRequest;
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
      memberId: number | string;
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
    mutationFn: (memberId: number | string) =>
      medkitService.removeMedkitMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueryKey.MEDKIT] });
    },
  });
};
