import { Field, Input } from "@chakra-ui/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface FormInputDateProps<T extends FieldValues> {
  label: string;
  placeholder: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  required?: boolean;
  min?: string;
  max?: string;
}

export function FormInputDate<T extends FieldValues>({
  label,
  placeholder,
  name,
  control,
  error,
  required = false,
  min,
  max,
}: FormInputDateProps<T>) {
  const { t } = useTranslation();

  return (
    <Field.Root invalid={!!error} gap={0.5} required={required}>
      <Field.Label>{label}</Field.Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="date"
            placeholder={placeholder}
            min={min}
            max={max}
            w={"100%"}
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
