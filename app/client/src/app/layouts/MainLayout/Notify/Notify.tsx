import { PATHS } from "@/app/router/paths";
import { Box, Button, Circle, Float } from "@chakra-ui/react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const Notify = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(PATHS.NOTIFICATIONS);
  };

  return (
    <Box position={"absolute"} right={4} top={4}>
      <Button
        borderRadius={"full"}
        variant={"surface"}
        position={"relative"}
        onClick={handleNavigate}
      >
        <IoNotificationsOutline />
        <Float placement={"top-end"}>
          <Circle size="5" bg="red" color="white">
            3
          </Circle>
        </Float>
      </Button>
    </Box>
  );
};
