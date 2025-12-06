import { IChatMessage } from "@/shared/types/entities";
import { Box, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { RelevantPillsTags } from "./RelevantPillsTags";

interface IConversationProps {
  isTyping: boolean;
  messages: IChatMessage[];
}

export const Conversation: FC<IConversationProps> = ({
  isTyping,
  messages,
}) => {
  const { t } = useTranslation();

  return (
    <VStack gap={4} align="stretch" pb={4}>
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        return (
          <Box
            key={msg.id}
            alignSelf={isUser ? "flex-end" : "flex-start"}
            maxW="80%"
          >
            <Box
              bg={isUser ? "blue.500" : "gray.100"}
              color={isUser ? "white" : "gray.800"}
              px={4}
              py={3}
              borderRadius="lg"
              fontSize="sm"
            >
              {!isUser ? (
                <MarkdownRenderer
                  content={msg.content}
                  color={isUser ? "white" : "gray.800"}
                />
              ) : (
                <Text>{msg.content}</Text>
              )}
              {msg.role === "assistant" &&
                msg.relevant_pills &&
                msg.relevant_pills.length > 0 && (
                  <RelevantPillsTags pills={msg.relevant_pills} />
                )}
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
        );
      })}
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
