import { useChatStore } from "@/app/store/chat";
import { suggestedActions } from "@/features/Chat/TypeMessage/data";
import { SendIcon } from "@/shared/icons";
import { Box, Button, HStack, Input } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface ITypeMessageProps {
  message: string;
  onChangeMessage: (message: string) => void;
  handleSendMessage: () => void;
}

export const TypeMessage: FC<ITypeMessageProps> = ({
  message,
  onChangeMessage,
  handleSendMessage,
}) => {
  const { t } = useTranslation();
  const { isLoading } = useChatStore();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderSuggestedActions = () => {
    return suggestedActions(onChangeMessage).map((action) => (
      <Button
        variant="outline"
        borderRadius="3xl"
        key={action.text}
        onClick={action.action}
      >
        {t(action.text)}
      </Button>
    ));
  };

  return (
    <Box
      borderRadius="2xl"
      m={6}
      mt={2}
      p={4}
      border="1px solid"
      borderColor="gray.200"
    >
      <HStack gap={2}>
        <Input
          border="none"
          outline="none"
          placeholder={t("placeholders.typeMessage")}
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          bg="transparent"
          _focus={{ boxShadow: "none" }}
          fontSize="sm"
          flex="1"
        />
        <Button
          p={2}
          rounded={"md"}
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
        >
          <SendIcon />
        </Button>
      </HStack>
      <HStack gap={3} mt={4}>
        {renderSuggestedActions()}
      </HStack>
    </Box>
  );
};
