import { Box, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const Greeting = () => {
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("subtitle.goodMorning");
    if (hour < 18) return t("subtitle.goodAfternoon");
    return t("subtitle.goodEvening");
  };

  return (
    <Box p={6} textAlign="center">
      <Box mb={4}>
        <Box
          w={12}
          h={12}
          mx="auto"
          bg="black"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={4}
        >
          <Text color="white" fontSize="xl" fontWeight="bold">
            AI
          </Text>
        </Box>
      </Box>
      <Text fontSize="2xl" fontWeight="medium" color="gray.700" mb={2}>
        {getGreeting()}
      </Text>
      <Text fontSize="lg" color="gray.500">
        {t("subtitle.howCanIHelpYouToday")}
      </Text>
    </Box>
  );
};
