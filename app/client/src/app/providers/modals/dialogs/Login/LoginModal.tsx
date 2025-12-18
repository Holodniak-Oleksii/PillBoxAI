import { AuthModalLayout } from "@/app/layouts/AuthModalLayout/AuthModalLayout";
import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { useLogin } from "@/services/auth/hooks";
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

export const LoginModal = create<IModalProps>(({ id }) => {
  const modal = useModal(id);
  const { t } = useTranslation();
  const { show: showSignUp } = useModal(EModalKey.SING_UP);
  const { mutateAsync: login, isPending } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<ILoginFormValues> = async (data) => {
    await login(data);
    modal.hide();
  };

  const redirectToSignUpHandler = () => {
    showSignUp();
    modal.hide();
  };

  return (
    <ModalLayout maxWidth={"fit-content"}>
      <AuthModalLayout>
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          align="stretch"
          gap={0}
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
            label={t("labels.password")}
            placeholder={t("placeholders.password")}
            type="password"
            autoComplete="current-password"
            name="password"
            control={control}
            error={errors.password?.message}
          />

          <Button type="submit" width="100%" mt={2} disabled={isPending}>
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
