import { PATHS } from "@/app/router/paths";
import { useChatStore } from "@/app/store/chat";
import imageLogo from "@/assets/logo.webp";
import { useMedkits } from "@/services/medkits/hooks";
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  Kbd,
  Span,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { BiBrain } from "react-icons/bi";
import { GoHistory } from "react-icons/go";
import { LuBriefcaseMedical, LuSearch } from "react-icons/lu";
import { MdOutlineNavigateNext } from "react-icons/md";
import { RiAddFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Account } from "./Account";

import { History } from "@/features/Chat/History";
import { EModalKey } from "@/shared/types/enums";
import { useModal } from "@ebay/nice-modal-react";
import { useRef, useState } from "react";
import { BiScan } from "react-icons/bi";
export const SideBar = () => {
  const { t } = useTranslation();
  const { data } = useMedkits();
  const navigate = useNavigate();
  const { createConversation } = useChatStore();
  const container = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { show: showCreateMedkit } = useModal(EModalKey.CREATE_MEDKIT);

  const renderMedkits = () =>
    data?.map((d) => (
      <Button
        key={d.id}
        variant={"subtle"}
        pl={8}
        w="100%"
        justifyContent={"flex-start"}
        color={"gray.400"}
        _hover={{
          bg: "gray.100",
          color: "blackAlpha.700",
        }}
        onClick={() => navigate(PATHS.MEDKIT(d.id))}
      >
        <Text fontSize={"sm"}>{d.name}</Text>
      </Button>
    ));

  const handleAskChat = () => {
    const conversation = createConversation();
    navigate(PATHS.CHAT(conversation.id));
  };

  return (
    <Box position={"relative"} ref={container} as={"aside"}>
      <Flex
        borderRightColor={"blackAlpha.300"}
        borderRightWidth={1}
        h={"100dvh"}
        direction={"column"}
        position={"relative"}
        zIndex={2}
        bg="white"
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
          <Button
            variant={"subtle"}
            w="100%"
            justifyContent={"flex-start"}
            onClick={handleAskChat}
          >
            <BiBrain />
            <Text fontSize={"sm"}>{t("button.askChat")}</Text>
          </Button>
          <Button variant={"subtle"} w="100%" justifyContent={"flex-start"}>
            <BiScan />
            <Text fontSize={"sm"}>{t("button.scan")}</Text>
          </Button>
          <Button
            variant={"subtle"}
            w="100%"
            justifyContent={"flex-start"}
            onClick={() => setOpen(true)}
          >
            <GoHistory />
            <Text fontSize={"sm"}>{t("button.history")}</Text>
            <Flex ml="auto">
              <MdOutlineNavigateNext />
            </Flex>
          </Button>
          <Flex gap={3} alignItems={"center"} pb={1} pl={4.5} pr={2}>
            <LuBriefcaseMedical />
            <Text fontSize={"sm"}>{t("titles.medkits")}</Text>
            <IconButton
              variant={"subtle"}
              ml="auto"
              onClick={() => showCreateMedkit()}
            >
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
      <History
        open={open}
        onOpenChange={(open) => setOpen(open)}
        container={container}
      />
    </Box>
  );
};
