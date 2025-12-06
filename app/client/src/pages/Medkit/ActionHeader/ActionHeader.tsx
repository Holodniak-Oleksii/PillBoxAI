/* eslint-disable react-hooks/exhaustive-deps */
import { useDeleteMedkit } from "@/services/medkits/hooks";
import { IMedkit } from "@/shared/types/entities";
import { EModalKey } from "@/shared/types/enums";
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
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { BiEdit } from "react-icons/bi";
import { LuEllipsisVertical, LuPlus, LuTrash2 } from "react-icons/lu";
import { useParams } from "react-router-dom";

interface IActionHeaderProps {
  medkit: IMedkit;
}
export const ActionHeader = ({ medkit }: IActionHeaderProps) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { mutateAsync: deleteMedkit } = useDeleteMedkit();

  const { show: showConfirmDialog } = useModal(EModalKey.CONFIRM_DIALOG);
  const { show: showCreateMedicine } = useModal(EModalKey.CREATE_MEDICINE);
  const { show: showEditMedkit } = useModal(EModalKey.CREATE_MEDKIT);

  const handleDeleteMedkit = useCallback(() => {
    showConfirmDialog({
      title: t("modals.deleteMedkit.title"),
      description: t("modals.deleteMedkit.description", {
        name: medkit.name,
      }),
      onConfirm: async () => {
        if (!id) return;
        await deleteMedkit(id);
      },
    });
  }, [id, medkit.name]);

  const handleCreateMedicine = useCallback(() => {
    showCreateMedicine({
      medkitId: id,
    });
  }, [id]);

  const handleEditMedkit = useCallback(() => {
    showEditMedkit({
      medkitId: id,
      defaultValues: medkit,
    });
  }, [id, medkit]);

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
                  onClick={handleCreateMedicine}
                >
                  <HStack gap={2}>
                    <Icon as={LuPlus} boxSize={4} />
                    <Text>{t("medkit.actions.addMedicine")}</Text>
                  </HStack>
                </Button>
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
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
