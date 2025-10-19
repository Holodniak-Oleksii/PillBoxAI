import { IChatConversation, IChatMessage } from "@/shared/types/entities";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IChatStore {
  conversations: IChatConversation[];
  currentConversationId: string | null;
  isLoading: boolean;

  createConversation: () => string;
  setCurrentConversation: (id: string) => void;
  addMessage: (
    conversationId: string,
    message: Omit<IChatMessage, "id" | "timestamp">
  ) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    content: string
  ) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<IChatStore>()(
  persist(
    (set) => ({
      conversations: [],
      currentConversationId: null,
      isLoading: false,

      createConversation: () => {
        const newConversation: IChatConversation = {
          id: crypto.randomUUID(),
          title: "New Chat",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newConversation.id,
        }));

        return newConversation.id;
      },

      setCurrentConversation: (id) => {
        set({ currentConversationId: id });
      },

      addMessage: (conversationId, message) => {
        const newMessage: IChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  updatedAt: new Date(),
                  title:
                    conv.messages.length === 0
                      ? message.content.slice(0, 50)
                      : conv.title,
                }
              : conv
          ),
        }));
      },

      updateMessage: (conversationId, messageId, content) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content } : msg
                  ),
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversationId:
            state.currentConversationId === id
              ? null
              : state.currentConversationId,
        }));
      },

      clearAllConversations: () => {
        set({
          conversations: [],
          currentConversationId: null,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "pillbox-chat",
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
      }),
    }
  )
);
