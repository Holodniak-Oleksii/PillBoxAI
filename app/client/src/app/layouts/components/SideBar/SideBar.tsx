import { Account } from "@/app/layouts/components/Account/Account";
import imageLogo from "@/assets/logo.webp";
import { Center, Flex, Image, Separator, Span } from "@chakra-ui/react";

export const SideBar = () => {
  return (
    <Flex
      as={"aside"}
      bg={"blackAlpha.50"}
      borderRightColor={"blackAlpha.200"}
      borderRightWidth={1}
      h={"100dvh"}
      direction={"column"}
    >
      <Flex p={4}>
        <Center gap={2}>
          <Image src={imageLogo} w={25} />
          <Span fontWeight={500}>
            Pillbox<Span fontWeight={900}>AI</Span>
          </Span>
        </Center>
      </Flex>
      <Separator borderColor={"blackAlpha.200"} />
      <Flex p={4} w="100%" flexGrow={1}></Flex>
      <Account />
    </Flex>
  );
};
