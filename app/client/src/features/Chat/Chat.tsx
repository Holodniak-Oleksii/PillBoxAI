import { useChatStore } from "@/app/store/chat";
import { usePillRecommendations } from "@/services/ai/hooks";
import { useEventHandler } from "@/shared/hooks";
import { IChatConversation } from "@/shared/types/entities";
import { Box, Flex } from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Conversation } from "./Conversation";
import { Greeting } from "./Greeting";
import { TypeMessage } from "./TypeMessage";

interface IChatProps {
  conversation: IChatConversation;
}

export const Chat: FC<IChatProps> = ({ conversation }) => {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMedkitId, setSelectedMedkitId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { addMessage, setLoading } = useChatStore();
  const { mutateAsync: getRecommendations, isPending } =
    usePillRecommendations();

  const handleSendMessage = async () => {
    if (!message.trim() || isPending) return;

    const userMessage = message.trim();
    setMessage("");
    setIsTyping(true);
    setLoading(true);

    addMessage(conversation.id, {
      content: userMessage,
      role: "user",
    });

    try {
      const response = await getRecommendations({
        query: userMessage,
        medkit_id: selectedMedkitId ? Number(selectedMedkitId) : undefined,
        language: i18n.language,
      });

      let aiResponse = response.recommendation;

      if (response.disclaimer) {
        aiResponse += `\n\n${response.disclaimer}`;
      }

      addMessage(conversation.id, {
        content: aiResponse,
        role: "assistant",
        relevant_pills: response.relevant_pills || [],
      });
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      const errorMessage = t("chat.error", {
        defaultValue:
          "Sorry, I encountered an error while processing your request. Please try again.",
      });
      addMessage(conversation.id, {
        content: errorMessage,
        role: "assistant",
      });
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };

  const handleEventSendMessage = useEventHandler(handleSendMessage);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [conversation.messages]);

  return (
    <Box
      h={"100%"}
      w={"100%"}
      display={"grid"}
      gridTemplateRows={"1fr auto"}
      px={4}
    >
      <Flex
        direction={"column"}
        w={"100%"}
        overflowY={"auto"}
        maxH={"100%"}
        justifyContent={
          conversation.messages.length === 0 ? "center" : "flex-start"
        }
        ref={scrollAreaRef}
      >
        <Box w={"100%"} maxW={"800px"} mx={"auto"}>
          <Greeting />
          <Conversation isTyping={isTyping} messages={conversation.messages} />
        </Box>
      </Flex>
      <Box w={"100%"} maxW={"800px"} mx={"auto"}>
        <TypeMessage
          message={message}
          onChangeMessage={setMessage}
          handleSendMessage={handleEventSendMessage}
          selectedMedkitId={selectedMedkitId}
          onMedkitChange={setSelectedMedkitId}
        />
      </Box>
    </Box>
  );
};
