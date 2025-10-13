import { useUserStore } from "@/app/store/user";
import { EModalKey } from "@/shared/types/enums";
import { Button, Flex } from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { useTranslation } from "react-i18next";

export const Account = () => {
  const isAuth = useUserStore((state) => state.isAuth);
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
        <></>
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
