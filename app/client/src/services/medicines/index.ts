import { API } from "@/services";
import { IMedicines, IPillRequest } from "@/shared/types/entities";

export const medicinesService = {
  getMedicines: async (): Promise<IMedicines[]> => {
    const response = await API.get<IMedicines[]>("/api/pills");
    return response.data;
  },

  getMedicineById: async (medicineId: string): Promise<IMedicines> => {
    const response = await API.get<IMedicines>(`/api/pills/${medicineId}`);
    return response.data;
  },

  getMedicinesByMedkitId: async (medkitId: string): Promise<IMedicines[]> => {
    const response = await API.get<IMedicines[]>(
      `/api/pills/medkit/${medkitId}`
    );
    return response.data;
  },

  searchMedicines: async (name: string): Promise<IMedicines[]> => {
    const response = await API.get<IMedicines[]>("/api/pills/search", {
      params: { name },
    });
    return response.data;
  },

  createMedicine: async (
    medkitId: string,
    createdById: number,
    pill: IPillRequest
  ): Promise<IMedicines> => {
    const response = await API.post<IMedicines>("/api/pills", pill, {
      params: { medkitId, createdById },
    });
    return response.data;
  },

  updateMedicine: async (
    medicineId: string,
    pill: IPillRequest
  ): Promise<IMedicines> => {
    const response = await API.put<IMedicines>(
      `/api/pills/${medicineId}`,
      pill
    );
    return response.data;
  },

  deleteMedicine: async (medicineId: number): Promise<void> => {
    await API.delete(`/api/pills/${medicineId}`);
  },

  takeMedicine: async (
    medicineId: string,
    quantity: number
  ): Promise<IMedicines> => {
    const response = await API.patch<IMedicines>(
      `/api/pills/${medicineId}/take`,
      null,
      { params: { quantity } }
    );
    return response.data;
  },

  addMedicineQuantity: async (
    medicineId: string,
    quantity: number
  ): Promise<IMedicines> => {
    const response = await API.patch<IMedicines>(
      `/api/pills/${medicineId}/add`,
      null,
      { params: { quantity } }
    );
    return response.data;
  },
};
