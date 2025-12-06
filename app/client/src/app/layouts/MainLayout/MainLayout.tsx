import { Box, Grid } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { SideBar } from "./SideBar";

export const MainLayout = () => {
  return (
    <Grid
      templateColumns={"minmax(max-content, 260px) 1fr"}
      position={"relative"}
    >
      <SideBar />
      <Box position={"relative"} h={"100dvh"} w={"100%"} overflow="auto">
        <Outlet />
      </Box>
    </Grid>
  );
};
