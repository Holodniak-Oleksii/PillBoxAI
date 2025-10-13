import NiceModal from "@ebay/nice-modal-react";
import { FC, PropsWithChildren } from "react";
import "./config";

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => (
  <NiceModal.Provider>{children}</NiceModal.Provider>
);
