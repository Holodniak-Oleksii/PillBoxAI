import { AuthModalLayout } from "@/app/layouts/AuthModalLayout/AuthModalLayout";
import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { useGoogleAuth, useRegister } from "@/services/auth/hooks";
import { IModalProps } from "@/shared/types/entities";
import { EModalKey } from "@/shared/types/enums";
import { FormInput } from "@/shared/ui-library/fields";
import { Button, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { signUpSchema } from "./schema";
import { ISignUpFormValues } from "./types";

export const SignUpModal = create<IModalProps>(() => {
  const modal = useModal();
  const { show: showLogin } = useModal(EModalKey.LOGIN);
  const { mutate: registerAction } = useRegister();
  const { mutate: googleAuth } = useGoogleAuth();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ISignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<ISignUpFormValues> = async () => {
    modal.hide();
    await registerAction();
  };

  const handleGoogleSignUp = async () => {
    console.log("Google sign up", getValues());
    await googleAuth();
  };

  const redirectToLoginHandler = () => {
    showLogin();
    modal.hide();
  };

  return (
    <ModalLayout maxWidth={"fit-content"}>
      <AuthModalLayout googleHandler={handleGoogleSignUp}>
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          align="stretch"
          gap={0.5}
        >
          <FormInput
            label={t("labels.name")}
            placeholder={t("placeholders.name")}
            type="text"
            autoComplete="name"
            register={register("name")}
            error={errors.name?.message}
          />

          <FormInput
            label={t("labels.email")}
            placeholder={t("placeholders.email")}
            type="email"
            autoComplete="email"
            register={register("email")}
            error={errors.email?.message}
          />

          <FormInput
            label={t("labels.password")}
            placeholder={t("placeholders.password")}
            type="password"
            autoComplete="new-password"
            register={register("password")}
            error={errors.password?.message}
          />

          <FormInput
            label={t("labels.confirmPassword")}
            placeholder={t("placeholders.confirmPassword")}
            type="password"
            autoComplete="new-password"
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" width="100%" mt={2}>
            {t("button.signUp")}
          </Button>
        </VStack>

        <HStack justify="center">
          <Text color="gray.700" fontSize="sm">
            {t("auth.hasAccount")}&nbsp;
            <Link color="blue.600" onClick={redirectToLoginHandler}>
              {t("button.login")}
            </Link>
          </Text>
        </HStack>
      </AuthModalLayout>
    </ModalLayout>
  );
});
