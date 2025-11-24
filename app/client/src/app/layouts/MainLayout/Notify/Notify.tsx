import { PATHS } from "@/app/router/paths";
import { Box, Button, Circle, Float, Icon } from "@chakra-ui/react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const Notify = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(PATHS.NOTIFICATIONS);
  };

  return (
    <Box position={"absolute"} right={5} top={3}>
      <Button
        borderRadius={"full"}
        variant={"surface"}
        position={"relative"}
        onClick={handleNavigate}
        size="xs"
      >
        <Icon as={IoNotificationsOutline} boxSize={5} />
        <Float placement={"top-end"}>
          <Circle size="3" fontSize="2xs" bg="red" color="white">
            3
          </Circle>
        </Float>
      </Button>
    </Box>
  );
};
