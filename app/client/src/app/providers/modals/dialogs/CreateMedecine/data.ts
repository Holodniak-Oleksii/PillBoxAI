import { EFilterFieldType, IFilterField } from "@/features/FilterCreator/types";
import z from "zod";

export const createMedicineFields: IFilterField[] = [
  {
    name: "name",
    label: "labels.name",
    type: EFilterFieldType.TEXT,
    placeholder: "placeholders.medicineName",
    required: true,
    inputType: "text",
  },
  {
    name: "activeIngredient",
    label: "labels.activeIngredient",
    type: EFilterFieldType.TEXT,
    placeholder: "placeholders.activeIngredient",
    required: true,
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
    required: true,
    rows: 3,
  },
  {
    name: "usageInstructions",
    label: "labels.usageInstructions",
    type: EFilterFieldType.TEXTAREA,
    placeholder: "placeholders.usageInstructions",
    required: true,
    rows: 3,
  },
  {
    name: "sideEffects",
    label: "labels.sideEffects",
    type: EFilterFieldType.TEXTAREA,
    placeholder: "placeholders.sideEffects",
    required: true,
    rows: 2,
  },
  {
    name: "contraindications",
    label: "labels.contraindications",
    type: EFilterFieldType.TEXTAREA,
    placeholder: "placeholders.contraindications",
    required: true,
    rows: 2,
  },
  {
    name: "storageConditions",
    label: "labels.storageConditions",
    type: EFilterFieldType.TEXTAREA,
    placeholder: "placeholders.storageConditions",
    required: true,
    rows: 2,
  },
];

export const createMedicineSchema = z.object({
  name: z
    .string({ message: "errors.isRequired" })
    .min(1, "errors.isRequired")
    .min(2, "errors.minLength"),
  activeIngredient: z
    .string({ message: "errors.isRequired" })
    .min(1, "errors.isRequired"),
  description: z
    .string({ message: "errors.isRequired" })
    .min(1, "errors.isRequired"),
  usageInstructions: z
    .string({ message: "errors.isRequired" })
    .min(1, "errors.isRequired"),
  sideEffects: z
    .string({ message: "errors.isRequired" })
    .min(1, "errors.isRequired"),
  contraindications: z
    .string({ message: "errors.isRequired" })
    .min(1, "errors.isRequired"),
  storageConditions: z
    .string({ message: "errors.isRequired" })
    .min(1, "errors.isRequired"),
  quantity: z
    .number({ message: "errors.isRequired" })
    .min(0, "errors.minValue"),
  expiryDate: z.string().min(1, "errors.isRequired"),
});
