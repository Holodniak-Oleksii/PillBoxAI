import { Box, Button, CloseButton, Dialog } from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { FC, PropsWithChildren } from "react";
import { SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface CRUDModalLayoutProps extends PropsWithChildren {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: SubmitHandler<any>;
}

export const CRUDModalLayout: FC<CRUDModalLayoutProps> = ({
  title,
  onSubmit,
  children,
}) => {
  const { t } = useTranslation();
  const { remove } = useModal();

  return (
    <Box as="form" onSubmit={onSubmit}>
      {title && (
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
            onClick={remove}
          />
        </Dialog.Header>
      )}
      <Dialog.Body p={4}>{children}</Dialog.Body>
      <Dialog.Footer
        justifyContent={"space-between"}
        gap={2}
        borderTopWidth={1}
        borderColor="gray.200"
        p={4}
      >
        <Button variant="outline" type="button" onClick={remove}>
          {t("button.cancel")}
        </Button>
        <Button type="submit">{t("button.save")}</Button>
      </Dialog.Footer>
    </Box>
  );
};
