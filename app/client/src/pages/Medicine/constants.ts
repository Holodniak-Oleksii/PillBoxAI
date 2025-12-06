import { IMedicines } from "@/shared/types/entities";

export const MEDICINE_ITEMS: (keyof IMedicines)[] = [
  "description",
  "usageInstructions",
  "sideEffects",
  "contraindications",
];
