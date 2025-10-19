import { Account } from "@/app/layouts/MainLayout/components/Account/Account";
import imageLogo from "@/assets/logo.webp";
import { useMedkits } from "@/services/medkits/hooks";
import {
  Button,
  Center,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  Kbd,
  Span,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { GiArtificialIntelligence } from "react-icons/gi";
import { GrAidOption } from "react-icons/gr";
import { LuSearch } from "react-icons/lu";
import { RiAddFill } from "react-icons/ri";
export const SideBar = () => {
  const { t } = useTranslation();
  const { data } = useMedkits();

  const renderMedkits = () =>
    data?.map((d) => (
      <Button
        key={d.id}
        variant={"subtle"}
        pl={8}
        w="100%"
        justifyContent={"flex-start"}
      >
        {d.name}
      </Button>
    ));

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
        <InputGroup
          mb={2}
          startElement={<LuSearch />}
          endElement={<Kbd>⌘K</Kbd>}
        >
          <Input
            placeholder={t("placeholders.searchMedkits")}
            outline={0}
            borderRadius={0}
            borderXWidth={0}
          />
        </InputGroup>
        <Button variant={"subtle"} w="100%" justifyContent={"flex-start"}>
          <GiArtificialIntelligence />
          {t("button.askChat")}
        </Button>
        <Flex gap={3} alignItems={"center"} pb={1} pl={4.5} pr={2}>
          <GrAidOption />
          <Span>{t("titles.medkits")}</Span>
          <IconButton variant={"subtle"} ml="auto">
            <RiAddFill />
          </IconButton>
        </Flex>
        <Flex
          w="100%"
          flexGrow={1}
          direction={"column"}
          overflow={"hidden"}
          overflowY={"auto"}
        >
          {renderMedkits()}
        </Flex>
      </Flex>
      <Account />
    </Flex>
  );
};
