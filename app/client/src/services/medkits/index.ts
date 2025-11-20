import { API } from "@/services";
import { IMedkit, IMedkitRequest, IMedMember } from "@/shared/types/entities";

export const medkitService = {
  getMedkits: async (): Promise<IMedkit[]> => {
    const response = await API.get<IMedkit[]>("/api/medkits");
    return response.data;
  },

  getMedkitById: async (medkitId: number): Promise<IMedkit> => {
    const response = await API.get<IMedkit>(`/api/medkits/${medkitId}`);
    return response.data;
  },

  getMedkitsByOwnerId: async (ownerId: number): Promise<IMedkit[]> => {
    const response = await API.get<IMedkit[]>(`/api/medkits/owner/${ownerId}`);
    return response.data;
  },

  searchMedkits: async (name: string): Promise<IMedkit[]> => {
    const response = await API.get<IMedkit[]>("/api/medkits/search", {
      params: { name },
    });
    return response.data;
  },

  createMedkit: async (
    ownerId: number,
    medkit: IMedkitRequest
  ): Promise<IMedkit> => {
    const response = await API.post<IMedkit>("/api/medkits", medkit, {
      params: { ownerId },
    });
    return response.data;
  },

  updateMedkit: async (
    medkitId: number,
    medkit: IMedkitRequest
  ): Promise<IMedkit> => {
    const response = await API.put<IMedkit>(`/api/medkits/${medkitId}`, medkit);
    return response.data;
  },

  deleteMedkit: async (medkitId: number): Promise<void> => {
    await API.delete(`/api/medkits/${medkitId}`);
  },

  getMedkitMembers: async (medkitId: number): Promise<IMedMember[]> => {
    const response = await API.get<IMedMember[]>(
      `/api/medkit-members/medkit/${medkitId}`
    );
    return response.data;
  },

  getUserMedkits: async (userId: number): Promise<IMedMember[]> => {
    const response = await API.get<IMedMember[]>(
      `/api/medkit-members/user/${userId}`
    );
    return response.data;
  },

  getMedkitMember: async (
    medkitId: number,
    userId: number
  ): Promise<IMedMember> => {
    const response = await API.get<IMedMember>(
      `/api/medkit-members/medkit/${medkitId}/user/${userId}`
    );
    return response.data;
  },

  addMedkitMember: async (
    medkitId: number,
    memberData: { userId: number; role: "OWNER" | "EDITOR" | "VIEWER" }
  ): Promise<IMedMember> => {
    const response = await API.post<IMedMember>(
      `/api/medkit-members/medkit/${medkitId}`,
      memberData
    );
    return response.data;
  },

  updateMemberRole: async (
    memberId: number,
    role: "OWNER" | "EDITOR" | "VIEWER"
  ): Promise<IMedMember> => {
    const response = await API.put<IMedMember>(
      `/api/medkit-members/${memberId}/role`,
      null,
      { params: { role } }
    );
    return response.data;
  },

  removeMedkitMember: async (memberId: number): Promise<void> => {
    await API.delete(`/api/medkit-members/${memberId}`);
  },
};
