/* eslint-disable react-hooks/exhaustive-deps */
import { useDeleteMedicine } from "@/services/medicines/hooks";
import { IMedicines } from "@/shared/types/entities";
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
  const { mutateAsync: deleteMedicine } = useDeleteMedicine();

  const { show: showConfirmDialog } = useModal(EModalKey.CONFIRM_DIALOG);
  const { show: showEditMedicine } = useModal(EModalKey.CREATE_MEDICINE);

  const handleDeleteMedicine = useCallback(() => {
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
  }, [medicineId, medicine.name]);

  const handleEditMedicine = useCallback(() => {
    showEditMedicine({
      medicine,
      medkitId,
    });
  }, [medicine, medkitId]);

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
