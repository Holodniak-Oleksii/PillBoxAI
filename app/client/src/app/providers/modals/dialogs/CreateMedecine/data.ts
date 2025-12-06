import { EFilterFieldType, IFilterField } from "@/features/FilterCreator/types";
import z from "zod";

export const createMedicineFields: IFilterField[] = [
  {
    name: "name",
    label: "labels.medicineName",
    type: EFilterFieldType.TEXT,
    placeholder: "placeholders.medicineName",
    required: true,
    inputType: "text",
  },
  {
    name: "activeSubstance",
    label: "labels.activeSubstance",
    type: EFilterFieldType.TEXT,
    placeholder: "placeholders.activeSubstance",
    required: false,
    inputType: "text",
  },
  {
    name: "quantity",
    label: "labels.quantity",
    type: EFilterFieldType.NUMBER,
    placeholder: "placeholders.quantity",
    required: true,
    min: 0,
  },
  {
    name: "expiryDate",
    label: "labels.expiryDate",
    type: EFilterFieldType.DATE,
    placeholder: "placeholders.expiryDate",
    required: true,
  },
  {
    name: "description",
    label: "labels.description",
    type: EFilterFieldType.TEXTAREA,
    placeholder: "placeholders.description",
    required: false,
    rows: 3,
  },
  {
    name: "usageInstructions",
    label: "labels.usageInstructions",
    type: EFilterFieldType.TEXTAREA,
    placeholder: "placeholders.usageInstructions",
    required: false,
    rows: 4,
  },
  {
    name: "sideEffects",
    label: "labels.sideEffects",
    type: EFilterFieldType.TEXTAREA,
    placeholder: "placeholders.sideEffects",
    required: false,
    rows: 4,
  },
  {
    name: "contraindications",
    label: "labels.contraindications",
    type: EFilterFieldType.TEXTAREA,
    placeholder: "placeholders.contraindications",
    required: false,
    rows: 5,
  },
];

// Matches PillRequest schema from OpenAPI
export const createMedicineSchema = z.object({
  name: z
    .string({ message: "errors.isRequired" })
    .min(1, "errors.isRequired")
    .max(255, "errors.maxLength"),
  activeSubstance: z
    .string()
    .max(255, "errors.maxLength")
    .optional()
    .or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  usageInstructions: z.string().optional().or(z.literal("")),
  sideEffects: z.string().optional().or(z.literal("")),
  contraindications: z.string().optional().or(z.literal("")),
  quantity: z
    .number({ message: "errors.isRequired" })
    .min(0, "errors.minValue"),
  expiryDate: z.string().min(1, "errors.isRequired"),
});
