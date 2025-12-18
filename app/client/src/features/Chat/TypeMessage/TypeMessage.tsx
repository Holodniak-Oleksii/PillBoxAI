import { useChatStore } from "@/app/store/chat";
import { useUserStore } from "@/app/store/user";
import { SendIcon } from "@/shared/icons";
import { Box, Button, HStack, Input } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { MedkitSelect } from "./MedkitSelect";

interface ITypeMessageProps {
  message: string;
  onChangeMessage: (message: string) => void;
  handleSendMessage: () => void;
  selectedMedkitId: string | null;
  onMedkitChange: (medkitId: string | null) => void;
}

export const TypeMessage: FC<ITypeMessageProps> = ({
  message,
  onChangeMessage,
  handleSendMessage,
  selectedMedkitId,
  onMedkitChange,
}) => {
  const { t } = useTranslation();
  const { isLoading } = useChatStore();
  const isAuth = useUserStore((state) => state.isAuth);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      borderRadius="2xl"
      mt={2}
      mb={4}
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
      <HStack gap={3} mt={4} flexWrap="wrap">
        {isAuth && (
          <MedkitSelect value={selectedMedkitId} onChange={onMedkitChange} />
        )}
      </HStack>
    </Box>
  );
};
