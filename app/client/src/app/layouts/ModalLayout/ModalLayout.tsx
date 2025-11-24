import { Dialog, Portal } from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { FC, PropsWithChildren } from "react";

type ModalLayoutProps = PropsWithChildren<{
  maxWidth?: string | number;
}>;

export const ModalLayout: FC<ModalLayoutProps> = ({
  children,
  maxWidth = 500,
}) => {
  const { visible, remove } = useModal();

  return (
    <Dialog.Root
      lazyMount
      open={visible}
      placement={"center"}
      motionPreset="slide-in-bottom"
      onOpenChange={(e) => {
        if (!e.open) remove();
      }}
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner p={[4, 8]} scrollbarWidth={"thin"}>
          <Dialog.Content bg="white" maxW={maxWidth} w="calc(100% - 32px)">
            {children}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
