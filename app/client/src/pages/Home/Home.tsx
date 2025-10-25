import { useChatStore } from "@/app/store/chat";
import { Chat } from "@/features/Chat/Chat";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { conversations, createConversation } = useChatStore();

  const conversation = useMemo(() => {
    if (id) {
      const foundConversation = conversations.find((conv) => conv.id === id);
      if (foundConversation) {
        return foundConversation;
      }
    }

    if (conversations.length === 0) {
      return createConversation();
    }

    return conversations[0];
  }, [conversations, id, createConversation]);

  useEffect(() => {
    if (conversation && conversation.id !== id) {
      setSearchParams({ id: conversation.id });
    }
  }, [conversation, id, setSearchParams]);

  return <Chat conversation={conversation} />;
};
