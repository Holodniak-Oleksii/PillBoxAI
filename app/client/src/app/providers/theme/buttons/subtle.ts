import { SystemStyleObject } from "@chakra-ui/react";

const subtle: SystemStyleObject = {
  bg: "transparent",
  color: "blackAlpha.700",
  _active: {
    transform: "scale(0.95)",
  },
  _hover: {
    bg: "gray.100",
  },
};

export default subtle;
