import { useChatStore } from "@/app/store/chat";
import { Box, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
interface IConversationProps {
  isTyping: boolean;
}

export const Conversation: FC<IConversationProps> = ({ isTyping }) => {
  const { t } = useTranslation();
  const { conversations, currentConversationId } = useChatStore();

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  return (
    <VStack gap={4} align="stretch" pb={4}>
      {currentConversation?.messages.map((msg) => (
        <Box
          key={msg.id}
          alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
          maxW="80%"
        >
          <Box
            bg={msg.role === "user" ? "blue.500" : "gray.100"}
            color={msg.role === "user" ? "white" : "gray.800"}
            px={4}
            py={3}
            borderRadius="lg"
            fontSize="sm"
          >
            <Text>{msg.content}</Text>
          </Box>
          <Text
            fontSize="xs"
            color="gray.400"
            mt={1}
            textAlign={msg.role === "user" ? "right" : "left"}
          >
            {new Date(msg.timestamp).toLocaleTimeString()}
          </Text>
        </Box>
      ))}
      {isTyping && (
        <Box alignSelf="flex-start" maxW="80%">
          <Box bg="gray.100" px={4} py={3} borderRadius="lg">
            <Text color="gray.600" fontSize="sm">
              {t("subtitle.aiIsTyping")}
            </Text>
          </Box>
        </Box>
      )}
    </VStack>
  );
};
