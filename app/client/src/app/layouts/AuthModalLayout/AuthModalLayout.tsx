import imageBG from "@/assets/auth-bg.webp";
import imageLogo from "@/assets/logo.webp";
import {
  AbsoluteCenter,
  Badge,
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Span,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

export const AuthModalLayout: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "1fr 420px" }}
      borderRadius={"md"}
      overflow={"hidden"}
    >
      <Box
        display={{ base: "none", md: "block" }}
        p={6}
        bg="gray.50"
        borderRightWidth="1px"
      >
        <Stack gap={6} h={"100%"}>
          <HStack justify="space-between">
            <Badge colorPalette="green" variant="subtle">
              {t("auth.AIMedicineOrganizer")}
            </Badge>
            <HStack gap={2}>
              <Badge>{t("auth.goodUsersExperience")}</Badge>
            </HStack>
          </HStack>
          <Flex
            position={"relative"}
            flexGrow={1}
            borderRadius={"md"}
            overflow={"hidden"}
          >
            <Image
              position={"absolute"}
              top={0}
              left={0}
              w={"100%"}
              h={"100%"}
              src={imageBG}
              alt="app logo"
              objectFit={"cover"}
              filter={"grayscale(50%) hue-rotate(315deg)"}
              opacity={0.5}
            />
            <AbsoluteCenter>
              <Center
                gap={1}
                bg={"whiteAlpha.900"}
                px={6}
                py={2}
                borderRadius={"md"}
              >
                <Image src={imageLogo} w={25} />
                <Heading size="2xl">
                  Pillbox<Span fontWeight={700}>AI</Span>
                </Heading>
              </Center>
            </AbsoluteCenter>
          </Flex>
          <Stack gap={3}>
            <Box p={3} bg="white" borderRadius="md" boxShadow="sm">
              <Text fontWeight="semibold">{t("auth.perfectAllInOneApp")}</Text>
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
          {children}
        </Stack>
      </Box>
    </Grid>
  );
};
