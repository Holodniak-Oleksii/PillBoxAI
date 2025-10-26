import { Box, Grid } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { SideBar } from "./SideBar";

export const MainLayout = () => {
  return (
    <Grid
      templateColumns={"minmax(max-content, 260px) minmax(max-content, 1fr)"}
    >
      <SideBar />
      <Box position={"relative"} h={"100dvh"} w={"100%"}>
        <Outlet />
      </Box>
    </Grid>
  );
};
