import { AuthModalLayout } from "@/app/layouts/AuthModalLayout/AuthModalLayout";
import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { useRegister } from "@/services/auth/hooks";
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

export const SignUpModal = create<IModalProps>(({ id }) => {
  const modal = useModal(id);
  const { show: showLogin } = useModal(EModalKey.LOGIN);
  const { mutateAsync: registerAction, isPending } = useRegister();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<ISignUpFormValues> = async (data) => {
    await registerAction(data);

    modal.hide();
  };

  const redirectToLoginHandler = () => {
    showLogin();
    modal.hide();
  };

  return (
    <ModalLayout maxWidth={"fit-content"}>
      <AuthModalLayout>
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          align="stretch"
          gap={0.5}
        >
          <FormInput
            label={t("labels.username")}
            placeholder={t("placeholders.username")}
            type="text"
            autoComplete="username"
            name="username"
            control={control}
            error={errors.username?.message}
          />

          <FormInput
            label={t("labels.email")}
            placeholder={t("placeholders.email")}
            type="email"
            autoComplete="email"
            name="email"
            control={control}
            error={errors.email?.message}
          />

          <FormInput
            label={t("labels.password")}
            placeholder={t("placeholders.password")}
            type="password"
            autoComplete="new-password"
            name="password"
            control={control}
            error={errors.password?.message}
          />

          <FormInput
            label={t("labels.confirmPassword")}
            placeholder={t("placeholders.confirmPassword")}
            type="password"
            autoComplete="new-password"
            name="confirmPassword"
            control={control}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" width="100%" mt={2} disabled={isPending}>
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
