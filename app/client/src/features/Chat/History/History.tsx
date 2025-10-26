import { useChatStore } from "@/app/store/chat";
import { Item } from "@/features/Chat/History/Item";
import { Box, Drawer, Input, Portal, Text, VStack } from "@chakra-ui/react";
import { FC, RefObject, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface IHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: RefObject<HTMLElement | null>;
}

export const History: FC<IHistoryProps> = ({
  open,
  onOpenChange,
  container,
}) => {
  const { t } = useTranslation();
  const conversations = useChatStore((state) => state.conversations);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations;
    }

    const query = searchQuery.toLowerCase();
    return conversations.filter((conversation) => {
      if (conversation.title.toLowerCase().includes(query)) {
        return true;
      }

      return conversation.messages.some((message) =>
        message.content.toLowerCase().includes(query)
      );
    });
  }, [conversations, searchQuery]);

  const handleChatSelect = (conversationId: string) => {
    navigate(`/?id=${conversationId}`);
    onOpenChange(false);
  };

  const renderConversations = () =>
    filteredConversations.map((conversation) => (
      <Item
        key={conversation.id}
        conversation={conversation}
        handleChatSelect={handleChatSelect}
      />
    ));

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      placement="start"
    >
      <Portal container={container}>
        <Drawer.Positioner
          pos={"absolute"}
          transform={"translateX(calc(100% + 1px))"}
          boxSize="full"
          zIndex={1}
        >
          <Drawer.Content
            borderRightColor={"blackAlpha.300"}
            borderRightWidth={1}
            boxShadow={"none"}
          >
            <Drawer.Header p={4}>
              <Drawer.Title>{t("chat.history")}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body p={0} display="flex" flexDirection="column" gap={4}>
              <Box px={4}>
                <Input
                  placeholder={t("placeholders.searchChats")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="sm"
                  outline="none"
                />
              </Box>
              {filteredConversations.length === 0 ? (
                <Box textAlign="center" p={4}>
                  <Text fontSize="md" fontWeight="bold" mb={1}>
                    {t("chat.noChats")}
                  </Text>
                  <Text color="gray.500" fontSize="xs" lineHeight={1.2}>
                    {t("chat.noChatsDescription")}
                  </Text>
                </Box>
              ) : (
                <VStack
                  gap={2}
                  px={4}
                  pb={6}
                  align="stretch"
                  flexGrow={1}
                  overflowY="auto"
                  css={{
                    "&::-webkit-scrollbar": { width: "2px" },
                    "&::-webkit-scrollbar-track": { bg: "transparent" },
                    "&::-webkit-scrollbar-thumb": {
                      bg: "gray.300",
                      borderRadius: "2px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      bg: "gray.400",
                    },
                  }}
                >
                  {renderConversations()}
                </VStack>
              )}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
