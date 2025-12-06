import { useChatStore } from "@/app/store/chat";
import { useUserStore } from "@/app/store/user";
import { Chat } from "@/features/Chat";
import { memo, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const Home = memo(() => {
  const isAuth = useUserStore((state) => state.isAuth);
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
    if (conversation && conversation.id !== id && isAuth) {
      setSearchParams({ id: conversation.id });
    }
  }, [conversation, id, setSearchParams, isAuth]);

  return <Chat conversation={conversation} />;
});
