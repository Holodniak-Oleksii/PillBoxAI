import { sideBarData } from "@/app/layouts/AccountLayout/SideBar/data";
import { PATHS } from "@/app/router/paths";
import { useUserStore } from "@/app/store/user";
import { Box, Button, Circle, Flex, Float, Icon, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const SideBar = () => {
  const logout = useUserStore((state) => state.logout);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = () => {
    logout();
    navigate(PATHS.HOME);
  };

  const renderItems = () =>
    Object.entries(sideBarData(handleLogOut, 3)).map(([key, value]) => (
      <Flex key={key} direction={"column"}>
        <Text fontWeight={"bold"} fontSize={"sm"} color={"gray.400"} mb={2}>
          {t(key)}
        </Text>
        {value.map((item) => (
          <Button
            {...(item.path
              ? { as: Link, to: item.path }
              : item.mainLink
              ? { as: "a", href: item.mainLink }
              : { as: "button", onClick: item.handleClick })}
            justifyContent={"flex-start"}
            variant={"subtle"}
            bg={
              item.path === location.pathname ? "blackAlpha.50" : "transparent"
            }
            key={item.label}
          >
            {item?.badge && item?.badge > 0 ? (
              <Box position={"relative"}>
                <Float placement={"top-end"}>
                  <Circle size="3" fontSize={"2xs"} bg="red" color="white">
                    {item.badge}
                  </Circle>
                </Float>
                <Icon as={item.icon} boxSize={5} />
              </Box>
            ) : (
              <Icon as={item.icon} boxSize={5} />
            )}
            <Text fontSize={"sm"}>{t(item.label)}</Text>
          </Button>
        ))}
      </Flex>
    ));

  return (
    <Box as="aside" position="sticky" pt={10} pb={12} top={0} h={"fit-content"}>
      <Flex
        pr={4}
        direction={"column"}
        gap={6}
        borderRight={"1px solid"}
        borderColor={"gray.200"}
      >
        {renderItems()}
      </Flex>
    </Box>
  );
};
