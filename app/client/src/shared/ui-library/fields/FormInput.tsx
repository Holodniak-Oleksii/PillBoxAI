import { Field, HStack, IconButton, Input } from "@chakra-ui/react";
import { ForwardedRef, forwardRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeOffIcon } from "../../icons";

export interface FormInputProps {
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, placeholder, type = "text", autoComplete, register, error },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const { t } = useTranslation();
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => setShowPassword((prev) => !prev);

    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <Field.Root invalid={!!error}>
        <Field.Label>{label}</Field.Label>
        <HStack>
          <Input
            {...register}
            type={inputType}
            autoComplete={autoComplete}
            placeholder={placeholder}
            ref={ref}
          />
          {isPassword && (
            <IconButton
              variant="ghost"
              size="sm"
              onClick={handleTogglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </IconButton>
          )}
        </HStack>
        <Field.ErrorText>{error ? t(error) : null}</Field.ErrorText>
      </Field.Root>
    );
  }
);

FormInput.displayName = "FormInput";
