import { Field, Textarea } from "@chakra-ui/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface FormTextAreaProps<T extends FieldValues> {
  label: string;
  placeholder: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  required?: boolean;
  rows?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
}

export function FormTextArea<T extends FieldValues>({
  label,
  placeholder,
  name,
  control,
  error,
  required = false,
  rows = 3,
  resize = "vertical",
}: FormTextAreaProps<T>) {
  const { t } = useTranslation();

  return (
    <Field.Root invalid={!!error} gap={0.5} required={required}>
      <Field.Label>{label}</Field.Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder={placeholder}
            rows={rows}
            resize={resize}
          />
        )}
      />
      {error ? (
        <Field.ErrorText width={"100%"} justifyContent={"end"}>
          {t(error)}
        </Field.ErrorText>
      ) : (
        <Field.HelperText>&nbsp;</Field.HelperText>
      )}
    </Field.Root>
  );
}
