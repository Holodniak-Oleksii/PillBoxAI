import { Account } from "@/app/layouts/MainLayout/components/Account/Account";
import imageLogo from "@/assets/logo.webp";
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Image,
  Span,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { GrAidOption } from "react-icons/gr";
import { RiAddFill } from "react-icons/ri";

export const SideBar = () => {
  const { t } = useTranslation();

  return (
    <Flex
      as={"aside"}
      borderRightColor={"blackAlpha.300"}
      borderRightWidth={1}
      h={"100dvh"}
      direction={"column"}
    >
      <Flex p={4}>
        <Center gap={2}>
          <Image src={imageLogo} w={25} />
          <Span fontWeight={500}>
            Pillbox<Span fontWeight={900}>AI</Span>
          </Span>
        </Center>
      </Flex>
      <Flex w="100%" flexGrow={1} direction={"column"}>
        <Box p={4} w={"100%"}>
          <Button variant={"outline"} w={"100%"} justifyContent={"flex-start"}>
            <RiAddFill />
            {t("button.askChat")}
          </Button>
        </Box>
        <Flex gap={3} alignItems={"center"} mt={4} pl={6} pr={2}>
          <GrAidOption />
          <Span>{t("titles.medicine")}</Span>
          <IconButton variant={"subtle"} ml="auto">
            <RiAddFill />
          </IconButton>
        </Flex>
      </Flex>
      <Account />
    </Flex>
  );
};
