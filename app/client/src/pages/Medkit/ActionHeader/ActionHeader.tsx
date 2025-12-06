/* eslint-disable react-hooks/exhaustive-deps */
import { useDeleteMedkit } from "@/services/medkits/hooks";
import { IMedkit } from "@/shared/types/entities";
import { EModalKey } from "@/shared/types/enums";
import { Button, Flex } from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { BiEdit } from "react-icons/bi";
import { LuPlus, LuTrash2 } from "react-icons/lu";
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
    <Flex gap={2}>
      <Button
        onClick={handleCreateMedicine}
        size="md"
        variant="outline"
        w="40px"
        h="40px"
      >
        <LuPlus />
      </Button>
      <Button
        onClick={handleEditMedkit}
        size="md"
        variant="outline"
        w="40px"
        h="40px"
      >
        <BiEdit />
      </Button>
      <Button
        onClick={handleDeleteMedkit}
        size="md"
        variant="outline"
        w="40px"
        h="40px"
      >
        <LuTrash2 />
      </Button>
    </Flex>
  );
};
