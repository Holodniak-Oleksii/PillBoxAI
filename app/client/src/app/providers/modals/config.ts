import { LoginModal } from "@/app/providers/modals/popups/Login/LoginModal";
import { SignUpModal } from "@/app/providers/modals/popups/SignUp/SignUpModal";
import { EModalKey } from "@/shared/types/enums";
import NiceModal from "@ebay/nice-modal-react";

NiceModal.register(EModalKey.LOGIN, LoginModal);
NiceModal.register(EModalKey.SING_UP, SignUpModal);
