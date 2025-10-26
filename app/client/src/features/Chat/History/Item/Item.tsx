import { useChatStore } from "@/app/store/chat";
import { formatDate } from "@/helpers/date";
import { IChatConversation } from "@/shared/types/entities";
import { Box, CloseButton, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface IItemProps {
  conversation: IChatConversation;
  handleChatSelect: (conversationId: string) => void;
}

export const Item: FC<IItemProps> = ({ conversation, handleChatSelect }) => {
  const { t } = useTranslation();
  const deleteConversation = useChatStore((state) => state.deleteConversation);

  const handleDeleteChat = (
    conversationId: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    deleteConversation(conversationId);
  };

  const getLastMessage = (conversation: IChatConversation) => {
    if (conversation.messages.length === 0) {
      return t("chat.noMessages");
    }
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.content.length > 50
      ? lastMessage.content.slice(0, 50) + "..."
      : lastMessage.content;
  };

  return (
    <Box
      p={2}
      borderWidth={1}
      borderRadius="md"
      cursor="pointer"
      position="relative"
      _hover={{ bg: "gray.50" }}
      onClick={() => handleChatSelect(conversation.id)}
    >
      <VStack align="start" gap={1} flex={1}>
        <Text
          fontWeight="bold"
          fontSize="sm"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          lineHeight={1.2}
        >
          {conversation.title}
        </Text>
        <Text
          fontSize="xs"
          color="gray.500"
          overflow="hidden"
          textOverflow="ellipsis"
          display="-webkit-box"
          WebkitLineClamp={2}
          lineHeight={1}
          style={{ WebkitBoxOrient: "vertical" }}
        >
          {getLastMessage(conversation)}
        </Text>
        <Text fontSize="2xs" color="gray.400" mt={2.5} lineHeight={1}>
          {formatDate(conversation.updatedAt)}
        </Text>
      </VStack>
      <CloseButton
        position="absolute"
        top={0}
        right={0}
        size="sm"
        onClick={(e) => handleDeleteChat(conversation.id, e)}
      />
    </Box>
  );
};
