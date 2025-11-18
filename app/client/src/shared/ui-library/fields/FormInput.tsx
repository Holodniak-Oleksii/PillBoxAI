import { Field, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuEye, LuEyeOff } from "react-icons/lu";

export interface FormInputProps<T extends FieldValues> {
  label: string;
  placeholder: string;
  name: Path<T>;
  control: Control<T>;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  error?: string;
  required?: boolean;
  startElement?: React.ReactNode;
}

export function FormInput<T extends FieldValues>({
  label,
  placeholder,
  name,
  control,
  type = "text",
  autoComplete,
  error,
  required = false,
  startElement,
}: FormInputProps<T>) {
  const { t } = useTranslation();
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <Field.Root invalid={!!error} gap={0.5} required={required}>
      <Field.Label>{label}</Field.Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputGroup
            startElement={startElement}
            endElement={
              isPassword ? (
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={handleTogglePassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <LuEye /> : <LuEyeOff />}
                </IconButton>
              ) : null
            }
          >
            <Input
              {...field}
              type={inputType}
              autoComplete={autoComplete}
              placeholder={placeholder}
            />
          </InputGroup>
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
