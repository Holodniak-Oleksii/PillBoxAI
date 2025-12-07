import { useUserStore } from "@/app/store/user";
import { useDeleteMedicine } from "@/services/medicines/hooks";
import { useMedkit, useMedkitMembers } from "@/services/medkits/hooks";
import { IMedicines } from "@/shared/types/entities";
import { EModalKey } from "@/shared/types/enums";
import { canEdit, getUserRole } from "@/shared/utils/medkitPermissions";
import {
  Button,
  HStack,
  Icon,
  Popover,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BiEdit } from "react-icons/bi";
import { LuEllipsisVertical, LuTrash2 } from "react-icons/lu";
import { useParams } from "react-router-dom";

interface IMedicineActionHeaderProps {
  medicine: IMedicines;
}

export const MedicineActionHeader = ({
  medicine,
}: IMedicineActionHeaderProps) => {
  const { medkitId, medicineId } = useParams();
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const { mutateAsync: deleteMedicine } = useDeleteMedicine();
  const { data: medkit } = useMedkit(medkitId, !!medkitId);
  const { data: members } = useMedkitMembers(medkitId, !!medkitId);

  // Get current user's role in this medkit
  const currentUserMember = useMemo(() => {
    if (!user || !medkit) return undefined;
    // Check if user is owner (from medkit.ownerId)
    if (medkit.ownerId === user.id) {
      return {
        id: -1,
        medkitId: medkit.id,
        userId: user.id,
        role: "OWNER" as const,
        addedAt: medkit.createdAt,
      };
    }
    // Check if user is in members list
    return getUserRole(members, user.id);
  }, [user, medkit, members]);

  const userCanEdit = canEdit(currentUserMember);

  const { show: showConfirmDialog } = useModal(EModalKey.CONFIRM_DIALOG);
  const { show: showEditMedicine } = useModal(EModalKey.CREATE_MEDICINE);

  const handleDeleteMedicine = useCallback(() => {
    if (!userCanEdit) return;
    showConfirmDialog({
      title: t("modals.deleteMedicine.title"),
      description: t("modals.deleteMedicine.description", {
        name: medicine.name,
      }),
      onConfirm: async () => {
        if (!medicineId) return;
        await deleteMedicine(medicineId);
      },
    });
  }, [
    medicineId,
    medicine.name,
    userCanEdit,
    showConfirmDialog,
    t,
    deleteMedicine,
  ]);

  const handleEditMedicine = useCallback(() => {
    if (!userCanEdit) return;
    showEditMedicine({
      medicine,
      medkitId,
    });
  }, [medicine, medkitId, userCanEdit, showEditMedicine]);

  if (!userCanEdit) {
    return null;
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button size="md" variant="plain" w="40px" h="40px">
          <LuEllipsisVertical />
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="auto" zIndex={1000}>
            <Popover.Body p={1}>
              <VStack gap={0} align="stretch">
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={handleEditMedicine}
                >
                  <HStack gap={2}>
                    <Icon as={BiEdit} boxSize={4} />
                    <Text>{t("medkit.actions.edit")}</Text>
                  </HStack>
                </Button>
                <Button
                  variant="ghost"
                  color="red.500"
                  justifyContent="flex-start"
                  onClick={handleDeleteMedicine}
                >
                  <HStack gap={2}>
                    <Icon as={LuTrash2} boxSize={4} />
                    <Text>{t("medkit.actions.delete")}</Text>
                  </HStack>
                </Button>
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
