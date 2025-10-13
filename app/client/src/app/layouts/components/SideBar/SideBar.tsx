import { Account } from "@/app/layouts/components/Account/Account";
import imageLogo from "@/assets/logo.webp";
import { Button, Center, Flex, Image, Span } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { GrAidOption } from "react-icons/gr";
import { RiAddFill } from "react-icons/ri";

export const SideBar = () => {
  const { t } = useTranslation();

  return (
    <Flex
      as={"aside"}
      bg={"blackAlpha.50"}
      borderRightColor={"blackAlpha.200"}
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
      <Flex p={4} w="100%" flexGrow={1} direction={"column"}>
        <Button
          variant={"outline"}
          bg={"whiteAlpha.500"}
          justifyContent={"flex-start"}
        >
          <RiAddFill />
          {t("button.askChat")}
        </Button>
        <Flex gap={3} alignItems={"center"} mt={4} py={4} px={2}>
          <GrAidOption />
          <Span>{t("titles.medicine")}</Span>
        </Flex>
      </Flex>
      <Account />
    </Flex>
  );
};
