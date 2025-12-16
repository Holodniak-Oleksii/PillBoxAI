import { Box, Grid, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { Outlet } from "react-router-dom";
import { SideBar } from "./SideBar";

export const MainLayout = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Grid
      templateColumns={isMobile ? "1fr" : "minmax(max-content, 260px) 1fr"}
      position={"relative"}
    >
      {!isMobile && <SideBar />}
      {isMobile && (
        <SideBar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      )}
      {isMobile && (
        <Box
          position="sticky"
          top={0}
          zIndex={10}
          bg="white"
          borderBottomWidth={1}
          borderBottomColor="blackAlpha.200"
          p={2}
        >
          <IconButton
            variant="ghost"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <HiMenu size={24} />
          </IconButton>
        </Box>
      )}
      <Box
        position={"relative"}
        h={!isMobile ? "100dvh" : "calc(100dvh - 64px)"}
        w={"100%"}
        overflow="auto"
      >
        <Outlet />
      </Box>
    </Grid>
  );
};
