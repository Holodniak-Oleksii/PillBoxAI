/* eslint-disable react-hooks/exhaustive-deps */
import { PATHS } from "@/app/router/paths";
import { useDeleteMedicine } from "@/services/medicines/hooks";
import { IMedicines, IMedkit } from "@/shared/types/entities";
import { EModalKey } from "@/shared/types/enums";
import { Button, HStack } from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { BiEdit } from "react-icons/bi";
import { LuArrowLeft, LuTrash2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";

interface IMedicineHeaderProps {
  medicine: IMedicines;
  medkit?: IMedkit;
}

export const MedicineHeader: FC<IMedicineHeaderProps> = (props) => {
  const { medicine, medkit } = props;

  const { mutateAsync: deleteMedicine } = useDeleteMedicine();
  const { show } = useModal(EModalKey.CREATE_MEDICINE);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { medkitId, medicineId } = useParams();

  const handleBack = useCallback(() => {
    if (medkitId) {
      navigate(PATHS.MEDKIT(medkitId));
    }
  }, [medkitId]);

  const handleEdit = useCallback(() => {
    if (medicine) {
      show({
        medicine,
        medkitId,
      });
    }
  }, [medicine, medkitId]);

  const handleDelete = useCallback(async () => {
    await deleteMedicine(medicineId!);
  }, [medicineId]);

  return (
    <HStack
      justify="space-between"
      align="center"
      borderBottomWidth={1}
      borderColor="gray.200"
      pb={4}
      position="sticky"
      top={0}
      bg="white"
      zIndex={1}
    >
      <Button
        onClick={handleBack}
        variant="ghost"
        size="sm"
        colorPalette="gray"
      >
        <LuArrowLeft />
        {medkit?.name || t("common.back")}
      </Button>
      <HStack gap={2}>
        <Button
          onClick={handleEdit}
          colorPalette="blue"
          size="sm"
          variant="outline"
        >
          <BiEdit />
          {t("common.edit")}
        </Button>
        <Button
          onClick={handleDelete}
          colorPalette="red"
          size="sm"
          variant="outline"
        >
          <LuTrash2 />
          {t("common.delete")}
        </Button>
      </HStack>
    </HStack>
  );
};
