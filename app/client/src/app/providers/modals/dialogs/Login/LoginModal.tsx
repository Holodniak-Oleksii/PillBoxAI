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
import { loginSchema } from "./schema";
import { ILoginFormValues } from "./types";

export const LoginModal = create<IModalProps>(() => {
  const modal = useModal();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<ILoginFormValues> = async () => {
    modal.hide();
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    console.log("Google sign in");
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
                {t("auth.signInToContinue")}
              </Text>
            </Stack>

            <Button variant="outline" width="100%" onClick={handleGoogleSignIn}>
              <HStack gap={2}>
                <GoogleIcon />
                <Text>{t("auth.signInWithGoogle")}</Text>
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
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              <Button type="submit" width="100%">
                {t("button.continue")}
              </Button>
            </VStack>

            <HStack justify="space-between">
              <Link color="blue.600" href="#">
                {t("auth.forgotPassword")}
              </Link>
              <Text color="gray.700" fontSize="sm">
                {t("auth.noAccount")}
                <Link color="blue.600">{t("button.signUp")}</Link>
              </Text>
            </HStack>
          </Stack>
        </Box>
      </Grid>
    </ModalLayout>
  );
});
