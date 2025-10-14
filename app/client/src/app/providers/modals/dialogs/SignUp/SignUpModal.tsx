import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import imageLogo from "@/assets/logo.webp";
import { GoogleIcon } from "@/shared/icons";
import { IModalProps } from "@/shared/types/entities";
import { FormInput } from "@/shared/ui-library/fields";
import {
  Badge,
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Image,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { signUpSchema } from "./schema";
import { ISignUpFormValues } from "./types";

export const SignUpModal = create<IModalProps>(() => {
  const modal = useModal();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<ISignUpFormValues> = async () => {
    modal.hide();
  };

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth
    console.log("Google sign up");
  };

  return (
    <ModalLayout maxWidth={"fit-content"}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 420px" }}>
        <Box
          display={{ base: "none", md: "block" }}
          p={6}
          bg="gray.50"
          borderRightWidth="1px"
        >
          <Stack gap={6}>
            <HStack justify="space-between">
              <Badge colorPalette="green" variant="subtle">
                {t("auth.AIMedicineOrganizer")}
              </Badge>
              <HStack gap={2}>
                <Badge>{t("auth.goodUsersExperience")}</Badge>
              </HStack>
            </HStack>
            <Image
              src={imageLogo}
              alt="app logo"
              h={200}
              objectFit={"contain"}
              w="auto"
              bg={"blackAlpha.100"}
              p={2}
            />
            <Stack gap={3}>
              <Box p={3} bg="white" borderRadius="md" boxShadow="sm">
                <Text fontWeight="semibold">
                  {t("auth.perfectAllInOneApp")}
                </Text>
                <Text color="gray.600" fontSize="sm">
                  {t("auth.soEasyAndPowerful")}
                </Text>
              </Box>
            </Stack>
          </Stack>
        </Box>

        <Box p={6}>
          <Stack gap={6}>
            <Stack gap={1}>
              <Heading size="2xl" color={"blackAlpha.850"}>
                {t("auth.join")}
              </Heading>
              <Text color="gray.600" fontSize="sm">
                {t("auth.createAccountToContinue")}
              </Text>
            </Stack>

            <Button variant="outline" width="100%" onClick={handleGoogleSignUp}>
              <HStack gap={2}>
                <GoogleIcon />
                <Text>{t("auth.signUpWithGoogle")}</Text>
              </HStack>
            </Button>

            <HStack>
              <Box flex="1" height="1px" bg="gray.200" />
              <Text fontSize="sm" color="gray.500" px={2}>
                {t("auth.orContinueWith")}
              </Text>
              <Box flex="1" height="1px" bg="gray.200" />
            </HStack>

            <VStack
              as="form"
              onSubmit={handleSubmit(onSubmit)}
              align="stretch"
              gap={4}
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
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              <FormInput
                label={t("labels.confirmPassword")}
                placeholder={t("placeholders.confirmPassword")}
                type="password"
                autoComplete="new-password"
                register={register("confirmPassword")}
                error={errors.confirmPassword?.message}
                showPasswordToggle={true}
                showPassword={showConfirmPassword}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />

              <Button type="submit" width="100%">
                {t("button.signUp")}
              </Button>
            </VStack>

            <HStack justify="center">
              <Text color="gray.700" fontSize="sm">
                {t("auth.hasAccount")}
                <Link color="blue.600">{t("button.login")}</Link>
              </Text>
            </HStack>
          </Stack>
        </Box>
      </Grid>
    </ModalLayout>
  );
});
