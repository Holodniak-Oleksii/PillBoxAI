import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { IModalProps } from "@/shared/types/entities";
import { create } from "@ebay/nice-modal-react";

export const LoginModal = create<IModalProps>(() => {
  return <ModalLayout>LoginDialog</ModalLayout>;
});
