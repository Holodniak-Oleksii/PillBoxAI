import { PATHS } from "@/app/router/paths";
import { useMedicine } from "@/services/medicines/hooks";
import { useMedkit } from "@/services/medkits/hooks";
import { IMedicines } from "@/shared/types/entities";
import { EModalKey } from "@/shared/types/enums";
import {
  AbsoluteCenter,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Separator,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import { useTranslation } from "react-i18next";
import { BiEdit } from "react-icons/bi";
import { LuArrowLeft, LuTrash2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";

export const Medicine = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { medkitId, medicineId } = useParams();
  const { data: medicine, isLoading: isLoadingMedicine } =
    useMedicine(medicineId);
  const { data: medkit, isLoading: isLoadingMedkit } = useMedkit(medkitId);
  const { show } = useModal(EModalKey.CREATE_MEDICINE);

  const handleBack = () => {
    if (medkitId) {
      navigate(PATHS.MEDKIT(medkitId));
    }
  };

  const handleEdit = () => {
    if (medicine) {
      show({
        medicine,
        medkitId,
        onSuccess: (updatedMedicine: IMedicines) => {
          console.log("Medicine updated:", updatedMedicine);
        },
      });
    }
  };

  const handleDelete = () => {
    // TODO: Add confirmation dialog
    console.log("Delete medicine:", medicine);
  };

  if (isLoadingMedicine || isLoadingMedkit) {
    return (
      <AbsoluteCenter>
        <Spinner size="xl" color="blackAlpha.900" />
      </AbsoluteCenter>
    );
  }

  if (!medicine) {
    return (
      <Flex p={4} flexDirection="column" gap={4} h="100%" w="100%">
        <Text>{t("medicine.notFound")}</Text>
        <Button
          onClick={handleBack}
          variant="outline"
          size="md"
          width="fit-content"
        >
          <LuArrowLeft />
          {t("common.back", "Назад")}
        </Button>
      </Flex>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpiringSoon = () => {
    const daysUntilExpiry = Math.floor(
      (new Date(medicine.expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = () => {
    return new Date(medicine.expiryDate) < new Date();
  };

  return (
    <Flex
      p={4}
      flexDirection="column"
      gap={4}
      h="100%"
      w="100%"
      overflow="auto"
    >
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
      <Box>
        <HStack gap={3}>
          <Text fontSize="3xl" fontWeight="bold" lineHeight={1} mb={4}>
            {medicine.name}
          </Text>
          {isExpired() && (
            <Badge colorPalette="red" size="lg">
              {t("medicine.expired")}
            </Badge>
          )}
          {!isExpired() && isExpiringSoon() && (
            <Badge colorPalette="orange" size="lg">
              {t("medicine.expiringSoon")}
            </Badge>
          )}
        </HStack>
        <Text fontSize="lg" color="gray.600">
          {medicine.activeIngredient}
        </Text>
      </Box>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        <Box bg="gray.50" p={4} borderRadius="md" borderWidth="1px">
          <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">
            {t("medicine.quantity")}
          </Text>
          <Text fontSize="2xl" fontWeight="semibold">
            {medicine.quantity} {t("medicine.units")}
          </Text>
        </Box>

        <Box bg="gray.50" p={4} borderRadius="md" borderWidth="1px">
          <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">
            {t("medicine.expiryDate")}
          </Text>
          <Text fontSize="2xl" fontWeight="semibold">
            {formatDate(medicine.expiryDate)}
          </Text>
        </Box>
      </Grid>

      <Box pl={4} mt={2}>
        <Text fontSize="xl" fontWeight="bold" mb={3}>
          {t("medicine.details")}
        </Text>
        <Flex flexDirection="column" gap={4}>
          {medicine.description && (
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                {t("medicine.description")}
              </Text>
              <Text fontSize="md" color="gray.700" whiteSpace="pre-wrap">
                {medicine.description}
              </Text>
            </Box>
          )}
          {medicine.usageInstructions && (
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                {t("medicine.usageInstructions")}
              </Text>
              <Text fontSize="md" color="gray.700" whiteSpace="pre-wrap">
                {medicine.usageInstructions}
              </Text>
            </Box>
          )}

          {medicine.sideEffects && (
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                {t("medicine.sideEffects")}
              </Text>
              <Text fontSize="md" color="gray.700" whiteSpace="pre-wrap">
                {medicine.sideEffects}
              </Text>
            </Box>
          )}

          {medicine.contraindications && (
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                {t("medicine.contraindications")}
              </Text>
              <Text fontSize="md" color="gray.700" whiteSpace="pre-wrap">
                {medicine.contraindications}
              </Text>
            </Box>
          )}

          {medicine.storageConditions && (
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                {t("medicine.storageConditions")}
              </Text>
              <Text fontSize="md" color="gray.700" whiteSpace="pre-wrap">
                {medicine.storageConditions}
              </Text>
            </Box>
          )}
        </Flex>
      </Box>

      <Box mt="auto" pt={4}>
        <Separator mb={4} />
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          <Box>
            <Text fontSize="sm" color="gray.600">
              {t("common.createdAt")}
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {formatDate(medicine.ts.createdAt)}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">
              {t("common.updatedAt")}
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {formatDate(medicine.ts.updatedAt)}
            </Text>
          </Box>
        </Grid>
      </Box>
    </Flex>
  );
};
