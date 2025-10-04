import { SideBar } from "@/app/layouts/components/SideBar/SideBar";
import { Box, Grid } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <Grid
      templateColumns={"minmax(max-content, 260px) minmax(max-content, 1fr)"}
    >
      <SideBar />
      <Box as={"main"} h={"100dvh"}>
        <Outlet />
      </Box>
    </Grid>
  );
};
