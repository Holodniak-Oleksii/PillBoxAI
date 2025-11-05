import { MEDICINES_MOCK } from "@/_mocks/medicines";
import { IMedicines } from "@/shared/types/entities";

export interface IMedicinesFilter {
  medkitId?: string;
  id?: string;
  name?: string;
  activeIngredient?: string;
  description?: string;
  usageInstructions?: string;
  sideEffects?: string;
  contraindications?: string;
  storageConditions?: string;
  quantity?: number | { min?: number; max?: number };
  expiryDate?: Date | { from?: Date; to?: Date };
  createdAt?: Date | { from?: Date; to?: Date };
  updatedAt?: Date | { from?: Date; to?: Date };
}

const matchesFilter = (
  medicine: IMedicines,
  filter: IMedicinesFilter
): boolean => {
  if (filter.medkitId && medicine.medkitId !== filter.medkitId) {
    return false;
  }

  if (filter.id && medicine.id !== filter.id) {
    return false;
  }

  if (
    filter.name &&
    !medicine.name.toLowerCase().includes(filter.name.toLowerCase())
  ) {
    return false;
  }

  if (
    filter.activeIngredient &&
    !medicine.activeIngredient
      .toLowerCase()
      .includes(filter.activeIngredient.toLowerCase())
  ) {
    return false;
  }

  if (
    filter.description &&
    !medicine.description
      .toLowerCase()
      .includes(filter.description.toLowerCase())
  ) {
    return false;
  }

  if (
    filter.usageInstructions &&
    !medicine.usageInstructions
      .toLowerCase()
      .includes(filter.usageInstructions.toLowerCase())
  ) {
    return false;
  }

  if (
    filter.sideEffects &&
    !medicine.sideEffects
      .toLowerCase()
      .includes(filter.sideEffects.toLowerCase())
  ) {
    return false;
  }

  if (
    filter.contraindications &&
    !medicine.contraindications
      .toLowerCase()
      .includes(filter.contraindications.toLowerCase())
  ) {
    return false;
  }

  if (
    filter.storageConditions &&
    !medicine.storageConditions
      .toLowerCase()
      .includes(filter.storageConditions.toLowerCase())
  ) {
    return false;
  }

  if (filter.quantity !== undefined) {
    if (typeof filter.quantity === "number") {
      if (medicine.quantity !== filter.quantity) {
        return false;
      }
    } else {
      if (
        filter.quantity.min !== undefined &&
        medicine.quantity < filter.quantity.min
      ) {
        return false;
      }
      if (
        filter.quantity.max !== undefined &&
        medicine.quantity > filter.quantity.max
      ) {
        return false;
      }
    }
  }

  if (filter.expiryDate) {
    if (filter.expiryDate instanceof Date) {
      if (medicine.expiryDate.getTime() !== filter.expiryDate.getTime()) {
        return false;
      }
    } else {
      if (
        filter.expiryDate.from &&
        medicine.expiryDate < filter.expiryDate.from
      ) {
        return false;
      }
      if (filter.expiryDate.to && medicine.expiryDate > filter.expiryDate.to) {
        return false;
      }
    }
  }

  if (filter.createdAt) {
    if (filter.createdAt instanceof Date) {
      if (medicine.ts.createdAt.getTime() !== filter.createdAt.getTime()) {
        return false;
      }
    } else {
      if (
        filter.createdAt.from &&
        medicine.ts.createdAt < filter.createdAt.from
      ) {
        return false;
      }
      if (filter.createdAt.to && medicine.ts.createdAt > filter.createdAt.to) {
        return false;
      }
    }
  }

  if (filter.updatedAt) {
    if (filter.updatedAt instanceof Date) {
      if (medicine.ts.updatedAt.getTime() !== filter.updatedAt.getTime()) {
        return false;
      }
    } else {
      if (
        filter.updatedAt.from &&
        medicine.ts.updatedAt < filter.updatedAt.from
      ) {
        return false;
      }
      if (filter.updatedAt.to && medicine.ts.updatedAt > filter.updatedAt.to) {
        return false;
      }
    }
  }

  return true;
};

export const medicinesService = {
  getMedicines: async (filter?: IMedicinesFilter): Promise<IMedicines[]> => {
    if (!filter) {
      return MEDICINES_MOCK;
    }

    return MEDICINES_MOCK.filter((medicine) => matchesFilter(medicine, filter));
  },

  getMedicinesByMedkitId: async (
    medkitId: string,
    filter?: Omit<IMedicinesFilter, "medkitId">
  ): Promise<IMedicines[]> => {
    return medicinesService.getMedicines({ ...filter, medkitId });
  },

  getMedicineById: async (
    medicineId: string
  ): Promise<IMedicines | undefined> => {
    return MEDICINES_MOCK.find((medicine) => medicine.id === medicineId);
  },
};
