import { z } from "zod";
import { EFilterFieldType, IFilterField } from "./types";

export const createFilterSchema = (config: IFilterField[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  config.forEach((field) => {
    switch (field.type) {
      case EFilterFieldType.TEXT:
        schemaFields[field.name] = z.string().optional();
        break;

      case EFilterFieldType.NUMBER:
        schemaFields[field.name] = z
          .number()
          .or(
            z
              .string()
              .transform((val) => (val === "" ? undefined : Number(val)))
          )
          .optional();
        break;

      case EFilterFieldType.DATE:
        schemaFields[field.name] = z.union([z.string(), z.date()]).optional();
        break;

      case EFilterFieldType.DATE_RANGE:
        schemaFields[field.name] = z
          .object({
            startDate: z.union([z.string(), z.date()]).optional(),
            endDate: z.union([z.string(), z.date()]).optional(),
          })
          .optional();
        break;

      case EFilterFieldType.SELECT:
        schemaFields[field.name] = z.string().nullable().optional();
        break;

      case EFilterFieldType.MULTI_SELECT:
        schemaFields[field.name] = z.array(z.string()).optional();
        break;

      case EFilterFieldType.CHECKBOX:
        schemaFields[field.name] = z.boolean().optional();
        break;

      default:
        schemaFields[field.name] = z.unknown().optional();
    }
  });

  return z.object(schemaFields);
};
