import { useCurrentUser } from "@/services/user/hooks";
import { AbsoluteCenter, Spinner } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

export const InitLayout: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, isError } = useCurrentUser();

  if (isLoading && !isError) {
    return (
      <AbsoluteCenter>
        <Spinner size="xl" />
      </AbsoluteCenter>
    );
  }

  return children;
};
