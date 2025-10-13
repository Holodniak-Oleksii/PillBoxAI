import { LoginModal } from "@/app/providers/modals/dialogs/Login/LoginModal";
import { SignUpModal } from "@/app/providers/modals/dialogs/SignUp/SignUpModal";
import { EModalKey } from "@/shared/types/enums";
import NiceModal from "@ebay/nice-modal-react";

NiceModal.register(EModalKey.LOGIN, LoginModal);
NiceModal.register(EModalKey.SING_UP, SignUpModal);
