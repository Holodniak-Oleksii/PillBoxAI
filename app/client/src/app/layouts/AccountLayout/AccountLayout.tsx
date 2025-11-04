import { matchPaths } from "@/app/layouts/AccountLayout/data";
import { PATHS } from "@/app/router/paths";
import { Box, Button, Flex, Grid, Icon, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SideBar } from "./SideBar";

export const AccountLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const title = matchPaths[location.pathname as keyof typeof matchPaths];

  return (
    <Box
      position={"relative"}
      h={"fit-content"}
      minH={"100dvh"}
      w={"100%"}
      maxWidth={1032}
      px={4}
      mx={"auto"}
    >
      <Grid
        gridTemplateColumns={
          "minmax(max-content, 200px) minmax(max-content, 1fr)"
        }
        gap={10}
      >
        <SideBar />
        <Box py={8}>
          <Flex justifyContent={"space-between"} alignItems={"center"} mb={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              {t(title)}
            </Text>
            <Button variant="outline" onClick={() => navigate(PATHS.HOME)}>
              <Icon as={MdOutlineArrowBackIos} boxSize={4} />
              {t("button.back")}
            </Button>
          </Flex>
          <Outlet />
        </Box>
      </Grid>
    </Box>
  );
};
