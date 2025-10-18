import { AuthModalLayout } from "@/app/layouts/AuthModalLayout/AuthModalLayout";
import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { useGoogleAuth, useLogin } from "@/services/auth/hooks";
import { IModalProps } from "@/shared/types/entities";
import { EModalKey } from "@/shared/types/enums";
import { FormInput } from "@/shared/ui-library/fields";
import { Button, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { loginSchema } from "./schema";
import { ILoginFormValues } from "./types";

export const LoginModal = create<IModalProps>(() => {
  const modal = useModal();
  const { t } = useTranslation();
  const { show: showSignUp } = useModal(EModalKey.SING_UP);
  const { mutate: googleAuth } = useGoogleAuth();
  const { mutate: login } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<ILoginFormValues> = async () => {
    await login();
    modal.hide();
  };

  const handleGoogleSignIn = async () => {
    // TODO: Implement Google OAuth
    console.log("Google sign in");
    await googleAuth();
    modal.hide();
  };

  const redirectToSignUpHandler = () => {
    showSignUp();
    modal.hide();
  };

  return (
    <ModalLayout maxWidth={"fit-content"}>
      <AuthModalLayout googleHandler={handleGoogleSignIn}>
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          align="stretch"
          gap={0}
        >
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
            autoComplete="current-password"
            register={register("password")}
            error={errors.password?.message}
          />

          <Button type="submit" width="100%" mt={2}>
            {t("button.continue")}
          </Button>
        </VStack>

        <HStack justify="center">
          <Text color="gray.700" fontSize="sm">
            {t("auth.noAccount")}&nbsp;
            <Link color="blue.600" onClick={redirectToSignUpHandler}>
              {t("button.signUp")}
            </Link>
          </Text>
        </HStack>
      </AuthModalLayout>
    </ModalLayout>
  );
});
