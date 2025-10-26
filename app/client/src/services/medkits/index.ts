import { MEDKIT_MOCK } from "@/_mocks/medkit";
import { IMedkit } from "@/shared/types/entities";

export const medkitService = {
  getMedkits: async (): Promise<IMedkit[]> => {
    return MEDKIT_MOCK;
  },

  getMedkitById: async (medkitId: string): Promise<IMedkit | undefined> => {
    return MEDKIT_MOCK.find((medkit) => medkit.id === medkitId);
  },

  createMedkit: async (medkit: IMedkit) => {
    MEDKIT_MOCK.push(medkit);
  },
};
