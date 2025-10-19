import { useChatStore } from "@/app/store/chat";
import { Conversation } from "@/features/Chat/components/Conversation/Conversation";
import { Greeting } from "@/features/Chat/components/Greeting/Greeting";
import { TypeMessage } from "@/features/Chat/components/TypeMessage/TypeMessage";
import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    currentConversationId,
    createConversation,
    addMessage,
    setLoading,
  } = useChatStore();

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  const handleSendMessage = async () => {
    if (!message.trim() || !currentConversationId) return;

    const userMessage = message.trim();
    setMessage("");
    setIsTyping(true);

    addMessage(currentConversationId, {
      content: userMessage,
      role: "user",
    });

    // @TODO: Implement AI response
    setLoading(true);
    setTimeout(() => {
      const aiResponse = `I understand you're asking about "${userMessage}". This is a simulated AI response. In a real implementation, this would connect to your AI service.`;

      addMessage(currentConversationId, {
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
  }, [currentConversation?.messages]);

  useEffect(() => {
    if (conversations.length === 0) {
      createConversation();
    }
  }, [conversations.length, createConversation]);
  console.log("conversations :", conversations);

  return (
    <Box h={"100%"} w={"100%"} display={"grid"} gridTemplateRows={"1fr auto"}>
      <Flex
        direction={"column"}
        w={"100%"}
        overflowY={"auto"}
        maxH={"100%"}
        justifyContent={conversations.length === 0 ? "center" : "flex-start"}
        ref={scrollAreaRef}
      >
        <Box w={"100%"} maxW={"800px"} mx={"auto"}>
          <Greeting />
          <Conversation isTyping={isTyping} />
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
