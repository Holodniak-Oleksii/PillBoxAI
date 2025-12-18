import { PATHS } from "@/app/router/paths";
import { useChatStore } from "@/app/store/chat";
import imageLogo from "@/assets/logo.webp";
import { useSearchMedkits } from "@/services/medkits/hooks";
import {
  Box,
  Button,
  Center,
  Drawer,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  Kbd,
  Span,
  Spinner,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { BiBrain } from "react-icons/bi";
import { GoHistory } from "react-icons/go";
import { LuBriefcaseMedical, LuSearch } from "react-icons/lu";
import { MdOutlineNavigateNext } from "react-icons/md";
import { RiAddFill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { Account } from "./Account";

import { History } from "@/features/Chat/History";
import { useDebounce, useEventHandler } from "@/shared/hooks";
import { EModalKey } from "@/shared/types/enums";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import { BiScan } from "react-icons/bi";

interface SideBarProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SideBar = ({ isOpen, onOpenChange }: SideBarProps = {}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: medkitId } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const container = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const { data: medkits, isLoading: isLoadingMedkits } =
    useSearchMedkits(debouncedSearchQuery);
  const { createConversation } = useChatStore();

  const { show: showCreateMedkit } = useModal(EModalKey.CREATE_MEDKIT);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isDrawerOpen, setIsDrawerOpen] = useState(isOpen ?? false);

  useEffect(() => {
    if (isOpen !== undefined) {
      setIsDrawerOpen(isOpen);
    }
  }, [isOpen]);

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    onOpenChange?.(open);
  };

  const renderMedkits = () =>
    medkits?.map((d) => (
      <Button
        key={d.id}
        variant={"subtle"}
        pl={8}
        w="100%"
        justifyContent={"flex-start"}
        color={medkitId === String(d.id) ? "blackAlpha.700" : "gray.400"}
        bg={medkitId === String(d.id) ? "gray.50" : "transparent"}
        _hover={{
          bg: "gray.100",
          color: "blackAlpha.700",
        }}
        onClick={() => handleMedkitClick(d.id)}
      >
        <Text fontSize={"sm"}>{d.name}</Text>
      </Button>
    ));

  const handleAskChat = () => {
    const conversation = createConversation();
    navigate(PATHS.CHAT(conversation.id));
  };

  const handleEventAskChat = useEventHandler(() => {
    handleAskChat();
    if (isMobile) {
      handleDrawerOpenChange(false);
    }
  });
  const handleEventOpenHistory = useEventHandler(() => {
    setOpen(true);
  });
  const handleEventCreateMedkit = useEventHandler(showCreateMedkit);
  const handleEventScanPills = useEventHandler(() => {
    NiceModal.show(EModalKey.IDENTIFY_PILLS, {
      medkitId: medkitId ? Number(medkitId) : undefined,
    });
    if (isMobile) {
      handleDrawerOpenChange(false);
    }
  });

  const handleMedkitClick = (medkitId: number) => {
    navigate(PATHS.MEDKIT(medkitId));
    if (isMobile) {
      handleDrawerOpenChange(false);
    }
  };

  const sidebarContent = (
    <Flex
      borderRightColor={"blackAlpha.300"}
      borderRightWidth={1}
      h={"100dvh"}
      direction={"column"}
      position={"relative"}
      zIndex={3}
      bg="white"
      w="100%"
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Button
          variant={"subtle"}
          w="100%"
          justifyContent={"flex-start"}
          onClick={handleEventAskChat}
        >
          <BiBrain />
          <Text fontSize={"sm"}>{t("button.askChat")}</Text>
        </Button>
        <Button
          variant={"subtle"}
          w="100%"
          justifyContent={"flex-start"}
          onClick={handleEventScanPills}
        >
          <BiScan />
          <Text fontSize={"sm"}>{t("button.scan")}</Text>
        </Button>
        <Button
          variant={"subtle"}
          w="100%"
          justifyContent={"flex-start"}
          onClick={() => handleEventOpenHistory()}
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
            onClick={() => handleEventCreateMedkit()}
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
          {isLoadingMedkits ? (
            <Center py={4}>
              <Spinner size="lg" />
            </Center>
          ) : medkits && medkits.length > 0 ? (
            renderMedkits()
          ) : (
            <Center
              py={4}
              display={"flex"}
              flexDirection={"column"}
              textAlign={"center"}
            >
              <Text fontSize={"sm"} fontWeight={500} color={"gray.400"}>
                {t("messages.noMedkits")}
              </Text>
            </Center>
          )}
        </Flex>
      </Flex>
      <Account />
    </Flex>
  );

  if (isMobile) {
    return (
      <>
        <Box ref={container} position="relative" as="div">
          <Drawer.Root
            open={isDrawerOpen}
            onOpenChange={(details) => handleDrawerOpenChange(details.open)}
            placement="start"
          >
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content boxShadow="lg" maxW="260px">
                <Drawer.Body p={0}>{sidebarContent}</Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Drawer.Root>
        </Box>
        <History
          open={open}
          onOpenChange={(open) => setOpen(open)}
          container={container}
          isMobile={isMobile}
        />
      </>
    );
  }

  return (
    <Box position={"relative"} ref={container} as={"aside"}>
      {sidebarContent}
      <History
        open={open}
        onOpenChange={(open) => setOpen(open)}
        container={container}
      />
    </Box>
  );
};
