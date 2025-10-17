import { useUserStore } from "@/app/store/user";
import { EModalKey } from "@/shared/types/enums";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { useTranslation } from "react-i18next";

export const Account = () => {
  const isAuth = useUserStore((state) => state.isAuth);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const { t } = useTranslation();
  const { show: showLogin } = useModal(EModalKey.LOGIN);
  const { show: showSignUp } = useModal(EModalKey.SING_UP);

  return (
    <Flex
      p={4}
      w="100%"
      borderColor={"blackAlpha.200"}
      borderTopWidth={1}
      gap={4}
    >
      {isAuth ? (
        <Flex w="100%" gap={4} align="center">
          <Box
            w="48px"
            h="48px"
            borderRadius="full"
            bg="black"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="lg"
            fontWeight="bold"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Box>
          <VStack align="start" flex={1} gap={0}>
            <Text fontSize="md" fontWeight="semibold" color="gray.700">
              {user?.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {user?.email}
            </Text>
          </VStack>
          <Button
            size="sm"
            variant="outline"
            onClick={logout}
            colorScheme="gray"
          >
            {t("button.logout")}
          </Button>
        </Flex>
      ) : (
        <Flex direction={"column"} gap={3} w={"100%"}>
          <Button onClick={() => showLogin()}>{t("button.login")}</Button>
          <Button variant={"outline"} onClick={() => showSignUp()}>
            {t("button.signUp")}
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
