import { TFilterValues } from "@/features/FilterCreator/types";
import { ETableName } from "@/shared/types/enums";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IFilterStore {
  filters: Record<ETableName, TFilterValues>;
  setFilters: (tableName: ETableName, filters: TFilterValues) => void;
  getFilters: (tableName: ETableName) => TFilterValues;
  clearFilters: (tableName: ETableName) => void;
  clearAllFilters: () => void;
}

export const useFilterStore = create<IFilterStore>()(
  persist(
    (set, get) => ({
      filters: {
        [ETableName.MEDKITS]: {},
        [ETableName.MEDICINES]: {},
        [ETableName.NOTIFICATIONS]: {},
      },

      setFilters: (tableName, filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [tableName]: filters,
          },
        })),

      getFilters: (tableName) => {
        return get().filters[tableName] || {};
      },

      clearFilters: (tableName) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [tableName]: {},
          },
        })),

      clearAllFilters: () =>
        set({
          filters: {
            [ETableName.MEDKITS]: {},
            [ETableName.MEDICINES]: {},
            [ETableName.NOTIFICATIONS]: {},
          },
        }),
    }),
    {
      name: "pillbox-filters",
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);
