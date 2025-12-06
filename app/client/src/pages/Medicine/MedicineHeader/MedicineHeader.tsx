import { PATHS } from "@/app/router/paths";
import { IMedicines, IMedkit } from "@/shared/types/entities";
import { Button, HStack } from "@chakra-ui/react";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { MedicineActionHeader } from "./MedicineActionHeader";

interface IMedicineHeaderProps {
  medicine: IMedicines;
  medkit?: IMedkit;
}

export const MedicineHeader: FC<IMedicineHeaderProps> = (props) => {
  const { medicine, medkit } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { medkitId } = useParams();

  const handleBack = useCallback(() => {
    if (medkitId) {
      navigate(PATHS.MEDKIT(medkitId));
    }
  }, [medkitId, navigate]);

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
      <MedicineActionHeader medicine={medicine} />
    </HStack>
  );
};
