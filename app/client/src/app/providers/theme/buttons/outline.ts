import { SystemStyleObject } from "@chakra-ui/react";

const outline: SystemStyleObject = {
  bg: "transparent",
  color: "blackAlpha.700",
  borderWidth: 1,
  borderColor: "blackAlpha.300",
  _active: {
    transform: "scale(0.95)",
  },
  _hover: {
    bg: "whiteAlpha.500",
  },
};

export default outline;
