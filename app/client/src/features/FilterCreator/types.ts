import { ETableName } from "@/shared/types/enums";
import { ISelectOption } from "@/shared/ui-library/fields";

export enum EFilterFieldType {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  NUMBER = "NUMBER",
  DATE = "DATE",
  DATE_RANGE = "DATE_RANGE",
  SELECT = "SELECT",
  MULTI_SELECT = "MULTI_SELECT",
  CHECKBOX = "CHECKBOX",
}

export interface IDateRange {
  startDate: string | Date;
  endDate: string | Date;
}

export interface IFilterField {
  name: string;
  label: string;
  type: EFilterFieldType;
  placeholder?: string;
  defaultValue?: unknown;
  options?: ISelectOption[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  autoComplete?: string;
  required?: boolean;
  inputType?: "text" | "email" | "password";
  searchable?: boolean;
  allowMouseWheel?: boolean;
  startElement?: React.ReactNode;
}

export type TFilterValues = Record<string, unknown>;

export interface IFilterCreatorProps<T extends TFilterValues = TFilterValues> {
  tableName: ETableName;
  config: IFilterField[];
  onSubmit: (values: T) => void;
}
