import { CreateMedkitModal } from "@/app/providers/modals/dialogs/CreateMedkit";
import { LoginModal } from "@/app/providers/modals/dialogs/Login";
import { SignUpModal } from "@/app/providers/modals/dialogs/SignUp";
import { EModalKey } from "@/shared/types/enums";
import NiceModal from "@ebay/nice-modal-react";

NiceModal.register(EModalKey.LOGIN, LoginModal);
NiceModal.register(EModalKey.SING_UP, SignUpModal);
NiceModal.register(EModalKey.CREATE_MEDKIT, CreateMedkitModal);
