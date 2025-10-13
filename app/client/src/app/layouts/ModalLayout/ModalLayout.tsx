import {
  DialogBackdrop,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  Portal,
} from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { FC, PropsWithChildren } from "react";

type ModalLayoutProps = PropsWithChildren<{
  maxWidth?: string | number;
}>;

export const ModalLayout: FC<ModalLayoutProps> = ({
  children,
  maxWidth = 500,
}) => {
  const { visible, hide } = useModal();

  return (
    <DialogRoot
      lazyMount
      open={visible}
      placement={"center"}
      motionPreset="slide-in-bottom"
      onOpenChange={(e) => {
        if (!e.open) hide();
      }}
    >
      <Portal>
        <DialogBackdrop bg="blackAlpha.600" />
        <DialogPositioner>
          <DialogContent bg="white" maxW={maxWidth} w="calc(100% - 32px)">
            {children}
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
};
