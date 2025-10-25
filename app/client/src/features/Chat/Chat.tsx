import { useChatStore } from "@/app/store/chat";
import { Conversation } from "@/features/Chat/components/Conversation/Conversation";
import { Greeting } from "@/features/Chat/components/Greeting/Greeting";
import { TypeMessage } from "@/features/Chat/components/TypeMessage/TypeMessage";
import { IChatConversation } from "@/shared/types/entities";
import { Box, Flex } from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";

interface IChatProps {
  conversation: IChatConversation;
}

export const Chat: FC<IChatProps> = ({ conversation }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { addMessage, setLoading } = useChatStore();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    setIsTyping(true);

    addMessage(conversation.id, {
      content: userMessage,
      role: "user",
    });

    // @TODO: Implement AI response
    setLoading(true);
    setTimeout(() => {
      const aiResponse = `I understand you're asking about "${userMessage}". This is a simulated AI response. In a real implementation, this would connect to your AI service.`;

      addMessage(conversation.id, {
        content: aiResponse,
        role: "assistant",
      });

      setIsTyping(false);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [conversation.messages]);

  return (
    <Box h={"100%"} w={"100%"} display={"grid"} gridTemplateRows={"1fr auto"}>
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
          handleSendMessage={handleSendMessage}
        />
      </Box>
    </Box>
  );
};
