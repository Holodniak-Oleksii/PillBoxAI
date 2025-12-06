import { EFilterFieldType, IFilterField } from "@/features/FilterCreator/types";
import z from "zod";

export const createMedkitFields: IFilterField[] = [
  {
    name: "name",
    label: "labels.title",
    type: EFilterFieldType.TEXT,
    placeholder: "placeholders.title",
    required: true,
  },
  {
    name: "description",
    label: "labels.description",
    type: EFilterFieldType.TEXTAREA,
    placeholder: "placeholders.description",
    required: false,
  },
];

export const createMedkitSchema = z.object({
  name: z
    .string({ message: "errors.isRequired" })
    .min(1, "errors.isRequired")
    .max(100, "errors.maxLength"),
  description: z
    .string()
    .max(500, "errors.maxLength")
    .optional()
    .or(z.literal("")),
});
