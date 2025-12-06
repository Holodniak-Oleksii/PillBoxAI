import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { IModalProps } from "@/shared/types/entities";
import { Box, Button, CloseButton, Dialog } from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { useTranslation } from "react-i18next";

interface IConfirmDialogProps extends IModalProps {
  title: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
}

export const ConfirmDialog = create<IConfirmDialogProps>(
  ({ title, description, onConfirm }) => {
    const { remove } = useModal();
    const { t } = useTranslation();

    const handleConfirm = async () => {
      await onConfirm();
      remove();
    };

    const handleCancel = () => {
      remove();
    };

    return (
      <ModalLayout maxWidth={"400px"}>
        <Box>
          <Dialog.Header
            p={4}
            position={"relative"}
            borderBottomWidth={1}
            borderColor="gray.200"
          >
            <Dialog.Title fontSize={"xl"}>{title}</Dialog.Title>
            <CloseButton
              position={"absolute"}
              right={2}
              top={2}
              onClick={handleCancel}
            />
          </Dialog.Header>
          {description && (
            <Dialog.Body p={4}>
              <Box>{description}</Box>
            </Dialog.Body>
          )}
          <Dialog.Footer
            justifyContent={"flex-end"}
            gap={2}
            borderTopWidth={1}
            borderColor="gray.200"
            p={4}
          >
            <Button variant="outline" type="button" onClick={handleCancel}>
              {t("button.cancel")}
            </Button>
            <Button type="button" onClick={handleConfirm}>
              {t("button.confirm")}
            </Button>
          </Dialog.Footer>
        </Box>
      </ModalLayout>
    );
  }
);
