import { ConfirmDialog } from "@/app/providers/modals/dialogs/ConfirmDialog";
import { CreateMedicineModal } from "@/app/providers/modals/dialogs/CreateMedecine";
import { CreateMedkitModal } from "@/app/providers/modals/dialogs/CreateMedkit";
import { EditIdentifiedPillsModal } from "@/app/providers/modals/dialogs/EditIdentifiedPills";
import { IdentifyPillsModal } from "@/app/providers/modals/dialogs/IdentifyPills";
import { LoginModal } from "@/app/providers/modals/dialogs/Login";
import { ManageMedkitMembersModal } from "@/app/providers/modals/dialogs/ManageMedkitMembers";
import { SignUpModal } from "@/app/providers/modals/dialogs/SignUp";
import { EModalKey } from "@/shared/types/enums";
import NiceModal from "@ebay/nice-modal-react";

NiceModal.register(EModalKey.LOGIN, LoginModal);
NiceModal.register(EModalKey.SING_UP, SignUpModal);
NiceModal.register(EModalKey.CREATE_MEDKIT, CreateMedkitModal);
NiceModal.register(EModalKey.CREATE_MEDICINE, CreateMedicineModal);
NiceModal.register(EModalKey.CONFIRM_DIALOG, ConfirmDialog);
NiceModal.register(EModalKey.IDENTIFY_PILLS, IdentifyPillsModal);
NiceModal.register(EModalKey.EDIT_IDENTIFIED_PILLS, EditIdentifiedPillsModal);
NiceModal.register(EModalKey.MANAGE_MEDKIT_MEMBERS, ManageMedkitMembersModal);
