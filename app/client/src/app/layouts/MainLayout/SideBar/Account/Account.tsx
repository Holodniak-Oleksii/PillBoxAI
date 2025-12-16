import { PATHS } from "@/app/router/paths";
import { useUserStore } from "@/app/store/user";
import { EModalKey } from "@/shared/types/enums";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const Account = () => {
  const isAuth = useUserStore((state) => state.isAuth);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const { t } = useTranslation();
  const { show: showLogin } = useModal(EModalKey.LOGIN);
  const { show: showSignUp } = useModal(EModalKey.SING_UP);
  const navigate = useNavigate();

  return (
    <Flex
      p={4}
      w="100%"
      borderColor={"blackAlpha.300"}
      borderTopWidth={1}
      gap={4}
    >
      {isAuth ? (
        <Flex w="100%" gap={2} align="center" cursor="pointer">
          <Box
            w="40px"
            h="40px"
            borderRadius="full"
            bg="black"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="lg"
            fontWeight="bold"
            onClick={() => navigate(PATHS.SETTINGS)}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Box>
          <VStack
            align="start"
            flex={1}
            gap={0}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            onClick={() => navigate(PATHS.SETTINGS)}
          >
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              maxW="100%"
            >
              {user?.username}
            </Text>
            <Text
              fontSize="xs"
              color="gray.500"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              maxW="100%"
            >
              {user?.email}
            </Text>
          </VStack>
          <Button
            size="xs"
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
