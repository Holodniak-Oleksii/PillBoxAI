import { useChatStore } from "@/app/store/chat";
import { suggestedActions } from "@/features/Chat/components/TypeMessage/data";
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
      <Button variant="subtle" key={action.text} onClick={action.action}>
        {t(action.text)}
      </Button>
    ));
  };

  return (
    <Box p={6} pt={0}>
      <Box borderRadius="xl" p={4} border="1px solid" borderColor="gray.200">
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
      </Box>

      <HStack gap={3} mt={4} justify="center">
        {renderSuggestedActions()}
      </HStack>
    </Box>
  );
};
