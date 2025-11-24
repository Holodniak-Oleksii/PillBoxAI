import { Field, NumberInput } from "@chakra-ui/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface FormInputNumericProps<T extends FieldValues> {
  label: string;
  placeholder: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  allowMouseWheel?: boolean;
}

export function FormInputNumeric<T extends FieldValues>({
  label,
  placeholder,
  name,
  control,
  error,
  required = false,
  min = 0,
  max,
  step = 1,
  allowMouseWheel = false,
}: FormInputNumericProps<T>) {
  const { t } = useTranslation();

  return (
    <Field.Root invalid={!!error} gap={0.5} required={required}>
      <Field.Label>{label}</Field.Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <NumberInput.Root
            value={field.value?.toString() || ""}
            onValueChange={(details) => {
              field.onChange(details.valueAsNumber);
            }}
            min={min}
            max={max}
            step={step}
            w={"100%"}
            allowMouseWheel={allowMouseWheel}
          >
            <NumberInput.Input placeholder={placeholder} />
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
          </NumberInput.Root>
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
