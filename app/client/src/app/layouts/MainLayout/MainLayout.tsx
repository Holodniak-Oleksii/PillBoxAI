import { Box, Grid } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Notify } from "./Notify";
import { SideBar } from "./SideBar";

export const MainLayout = () => {
  return (
    <Grid
      templateColumns={"minmax(max-content, 260px) minmax(max-content, 1fr)"}
      position={"relative"}
    >
      <SideBar />
      <Box position={"relative"} h={"100dvh"} w={"100%"}>
        <Outlet />
        <Notify />
      </Box>
    </Grid>
  );
};
