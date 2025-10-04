import { useUserStore } from "@/app/store/user";
import { Button, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const Account = () => {
  const isAuth = useUserStore((state) => state.isAuth);
  const { t } = useTranslation();
  return (
    <Flex
      p={4}
      w="100%"
      borderColor={"blackAlpha.200"}
      borderTopWidth={1}
      gap={4}
    >
      {isAuth ? (
        <></>
      ) : (
        <Flex direction={"column"} gap={3} w={"100%"}>
          <Button>{t("button.login")}</Button>
          <Button variant={"outline"}>{t("button.signUp")}</Button>
        </Flex>
      )}
    </Flex>
  );
};
