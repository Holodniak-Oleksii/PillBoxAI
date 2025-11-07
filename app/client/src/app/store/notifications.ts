import { create } from "zustand";

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface INotificationFilters {
  medkitId: string | null;
  dateRange: DateRange | null;
}

interface INotificationStore {
  filters: INotificationFilters;
  setMedkitFilter: (medkitId: string | null) => void;
  setDateRangeFilter: (dateRange: DateRange | null) => void;
  clearFilters: () => void;
}

export const useNotificationStore = create<INotificationStore>((set) => ({
  filters: {
    medkitId: null,
    dateRange: null,
  },
  setMedkitFilter: (medkitId) =>
    set((state) => ({
      filters: { ...state.filters, medkitId },
    })),
  setDateRangeFilter: (dateRange) =>
    set((state) => ({
      filters: { ...state.filters, dateRange },
    })),
  clearFilters: () =>
    set({
      filters: {
        medkitId: null,
        dateRange: null,
      },
    }),
}));
