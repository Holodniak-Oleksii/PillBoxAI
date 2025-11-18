import {
  DateRange,
  FormDateRangePicker,
  FormInput,
  FormInputDate,
  FormInputNumeric,
  FormSelect,
  FormTextArea,
  ISelectOption,
} from "@/shared/ui-library/fields";
import { Checkbox as ChakraCheckbox, Field } from "@chakra-ui/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { EFilterFieldType, IFilterField } from "./types";

interface IRenderFieldProps<T extends FieldValues = FieldValues> {
  field: IFilterField;
  control: Control<T>;
  error?: string;
}

export const renderFilterField = <T extends FieldValues = FieldValues>({
  field,
  control,
  error,
}: IRenderFieldProps<T>) => {
  switch (field.type) {
    case EFilterFieldType.TEXT:
      return (
        <FormInput
          label={field.label}
          placeholder={field.placeholder || ""}
          name={field.name as Path<T>}
          control={control}
          type={field.inputType || "text"}
          error={error}
          autoComplete={field.autoComplete}
          required={field.required}
          startElement={field.startElement}
        />
      );

    case EFilterFieldType.TEXTAREA:
      return (
        <FormTextArea
          label={field.label}
          placeholder={field.placeholder || ""}
          name={field.name as Path<T>}
          control={control}
          error={error}
          rows={field.rows}
          resize={field.resize}
          required={field.required}
        />
      );

    case EFilterFieldType.NUMBER:
      return (
        <FormInputNumeric
          label={field.label}
          placeholder={field.placeholder || ""}
          name={field.name as Path<T>}
          control={control}
          error={error}
          min={field.min}
          max={field.max}
          step={field.step}
          allowMouseWheel={field.allowMouseWheel}
          required={field.required}
        />
      );

    case EFilterFieldType.DATE:
      return (
        <FormInputDate
          label={field.label}
          placeholder={field.placeholder || ""}
          name={field.name as Path<T>}
          control={control}
          error={error}
          min={field.min?.toString()}
          max={field.max?.toString()}
          required={field.required}
        />
      );

    case EFilterFieldType.DATE_RANGE:
      return (
        <Controller
          name={field.name as Path<T>}
          control={control}
          render={({ field: formField }) => {
            const value = formField.value as
              | { startDate?: string | Date; endDate?: string | Date }
              | null
              | undefined;

            const dateRange: DateRange | null = value
              ? {
                  startDate: value.startDate ? new Date(value.startDate) : null,
                  endDate: value.endDate ? new Date(value.endDate) : null,
                }
              : null;

            return (
              <FormDateRangePicker
                label={field.label}
                placeholder={field.placeholder}
                value={dateRange}
                onChange={(range) => {
                  if (range) {
                    formField.onChange({
                      startDate: range.startDate?.toISOString() || "",
                      endDate: range.endDate?.toISOString() || "",
                    });
                  } else {
                    formField.onChange(null);
                  }
                }}
                error={error}
                required={field.required}
              />
            );
          }}
        />
      );

    case EFilterFieldType.SELECT:
      return (
        <Controller
          name={field.name as Path<T>}
          control={control}
          render={({ field: formField }) => (
            <FormSelect
              label={field.label}
              placeholder={field.placeholder || "Select option"}
              options={field.options || []}
              value={formField.value as string | null}
              onChange={(value) => formField.onChange(value)}
              error={error}
              required={field.required}
              searchable={field.searchable}
            />
          )}
        />
      );

    case EFilterFieldType.MULTI_SELECT:
      return (
        <Controller
          name={field.name as Path<T>}
          control={control}
          render={({ field: formField }) => {
            const selectedValues = (formField.value as string[]) || [];
            const options = field.options || [];

            return (
              <Field.Root invalid={!!error} gap={0.5}>
                <Field.Label>{field.label}</Field.Label>
                <div
                  style={{
                    border: error ? "1px solid #e53e3e" : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {options.map((option: ISelectOption) => {
                    const isChecked = selectedValues.includes(option.value);
                    return (
                      <ChakraCheckbox.Root
                        key={option.value}
                        checked={isChecked}
                        onCheckedChange={(e) => {
                          const checked = e.checked;
                          const newValues = checked
                            ? [...selectedValues, option.value]
                            : selectedValues.filter((v) => v !== option.value);
                          formField.onChange(newValues);
                        }}
                      >
                        <ChakraCheckbox.HiddenInput />
                        <ChakraCheckbox.Control />
                        <ChakraCheckbox.Label>
                          {option.label}
                        </ChakraCheckbox.Label>
                      </ChakraCheckbox.Root>
                    );
                  })}
                </div>
                {error ? (
                  <Field.ErrorText width="100%" justifyContent="end">
                    {error}
                  </Field.ErrorText>
                ) : (
                  <Field.HelperText>&nbsp;</Field.HelperText>
                )}
              </Field.Root>
            );
          }}
        />
      );

    case EFilterFieldType.CHECKBOX:
      return (
        <Controller
          name={field.name as Path<T>}
          control={control}
          render={({ field: formField }) => (
            <Field.Root invalid={!!error} gap={0.5}>
              <ChakraCheckbox.Root
                checked={formField.value as boolean}
                onCheckedChange={(e) => formField.onChange(e.checked)}
              >
                <ChakraCheckbox.HiddenInput />
                <ChakraCheckbox.Control />
                <ChakraCheckbox.Label>{field.label}</ChakraCheckbox.Label>
              </ChakraCheckbox.Root>
              {error && (
                <Field.ErrorText width="100%" justifyContent="end">
                  {error}
                </Field.ErrorText>
              )}
            </Field.Root>
          )}
        />
      );

    default:
      return null;
  }
};
