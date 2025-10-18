import { Field, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { ForwardedRef, forwardRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuEye, LuEyeOff } from "react-icons/lu";

export interface FormInputProps {
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  register: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
  startElement?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      placeholder,
      type = "text",
      autoComplete,
      register,
      error,
      required = false,
      startElement,
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const { t } = useTranslation();
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => setShowPassword((prev) => !prev);

    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <Field.Root invalid={!!error} ref={ref} gap={0.5} required={required}>
        <Field.Label>{label}</Field.Label>
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
            {...register}
            type={inputType}
            autoComplete={autoComplete}
            placeholder={placeholder}
          />
        </InputGroup>
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
);

FormInput.displayName = "FormInput";
