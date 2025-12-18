import { PATHS } from "@/app/router/paths";
import { useUserStore } from "@/app/store/user";
import { useDeleteMedkit, useMedkitMembers } from "@/services/medkits/hooks";
import { IMedkit } from "@/shared/types/entities";
import { EModalKey } from "@/shared/types/enums";
import {
  canDelete,
  canEdit,
  canManageMembers,
  getUserRole,
} from "@/shared/utils/medkitPermissions";
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
import { LuEllipsisVertical, LuPlus, LuShare2, LuTrash2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";

interface IActionHeaderProps {
  medkit: IMedkit;
}
export const ActionHeader = ({ medkit }: IActionHeaderProps) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const { mutateAsync: deleteMedkit } = useDeleteMedkit();
  const { data: members } = useMedkitMembers(id);

  const { show: showConfirmDialog } = useModal(EModalKey.CONFIRM_DIALOG);
  const { show: showCreateMedicine } = useModal(EModalKey.CREATE_MEDICINE);
  const { show: showEditMedkit } = useModal(EModalKey.CREATE_MEDKIT);
  const { show: showManageMembers } = useModal(EModalKey.MANAGE_MEDKIT_MEMBERS);

  // Get current user's role in this medkit
  const currentUserMember = useMemo(() => {
    if (!user) return undefined;
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
  const userCanDelete = canDelete(currentUserMember);
  const userCanManageMembers = canManageMembers(currentUserMember);

  const handleDeleteMedkit = useCallback(() => {
    showConfirmDialog({
      title: t("modals.deleteMedkit.title"),
      description: t("modals.deleteMedkit.description", {
        name: medkit.name,
      }),
      onConfirm: async () => {
        if (!id) return;
        await deleteMedkit(id);
        navigate(PATHS.HOME);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCreateMedicine = useCallback(() => {
    showCreateMedicine({
      medkitId: id,
    });
  }, [id, showCreateMedicine]);

  const handleEditMedkit = useCallback(() => {
    showEditMedkit({
      medkitId: id,
      defaultValues: medkit,
    });
  }, [id, medkit, showEditMedkit]);

  const handleManageMembers = useCallback(() => {
    if (!id) return;
    showManageMembers({
      medkitId: id,
    });
  }, [id, showManageMembers]);

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
                {userCanEdit && (
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={handleCreateMedicine}
                  >
                    <HStack gap={2}>
                      <Icon as={LuPlus} boxSize={4} />
                      <Text>{t("medkit.actions.addMedicine")}</Text>
                    </HStack>
                  </Button>
                )}
                {userCanEdit && (
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={handleEditMedkit}
                  >
                    <HStack gap={2}>
                      <Icon as={BiEdit} boxSize={4} />
                      <Text>{t("medkit.actions.editMedkit")}</Text>
                    </HStack>
                  </Button>
                )}
                {userCanManageMembers && (
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={handleManageMembers}
                  >
                    <HStack gap={2}>
                      <Icon as={LuShare2} boxSize={4} />
                      <Text>{t("medkit.actions.shareMedkit")}</Text>
                    </HStack>
                  </Button>
                )}
                {userCanDelete && (
                  <Button
                    variant="ghost"
                    color="red.500"
                    justifyContent="flex-start"
                    onClick={handleDeleteMedkit}
                  >
                    <HStack gap={2}>
                      <Icon as={LuTrash2} boxSize={4} />
                      <Text>{t("medkit.actions.deleteMedkit")}</Text>
                    </HStack>
                  </Button>
                )}
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
