import { useMedicines } from "@/services/medicines/hooks";
import { useMedkits } from "@/services/medkits/hooks";
import { useCurrentUser } from "@/services/user/hooks";
import { EAvailableLanguage } from "@/shared/types/enums";
import { FormSelect, ISelectOption } from "@/shared/ui-library/fields";
import { Box, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const { data: medkits, isLoading: isLoadingMedkits } = useMedkits();
  const { data: medicines, isLoading: isLoadingMedicines } = useMedicines();

  const expiredMedicinesCount = useMemo(() => {
    if (!medicines) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return medicines.filter((medicine) => {
      const expiryDate = new Date(medicine.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);
      return expiryDate < today;
    }).length;
  }, [medicines]);

  const languageOptions: ISelectOption[] = useMemo(
    () => [
      { value: EAvailableLanguage.EN, label: "English" },
      { value: EAvailableLanguage.UK, label: "Українська" },
    ],
    []
  );

  const handleLanguageChange = (value: string | number | null) => {
    if (value) {
      i18n.changeLanguage(value as string);
    }
  };

  const isLoading = isLoadingUser || isLoadingMedkits || isLoadingMedicines;

  return (
    <Box display="flex" flexDirection="column" gap={6} maxW="800px" mx="auto">
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <Spinner size="lg" />
        </Box>
      ) : (
        <VStack gap={6} align="stretch">
          <Box
            p={4}
            borderWidth={1}
            borderColor="gray.200"
            borderRadius="md"
            backgroundColor="white"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              {t("account.userInfo")}
            </Text>
            <VStack gap={2} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  {t("labels.username")}
                </Text>
                <Text fontSize="md" fontWeight="medium">
                  {user?.username || "-"}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  {t("labels.email")}
                </Text>
                <Text fontSize="md" fontWeight="medium">
                  {user?.email || "-"}
                </Text>
              </Box>
            </VStack>
          </Box>

          <Box
            p={4}
            borderWidth={1}
            borderColor="gray.200"
            borderRadius="md"
            backgroundColor="white"
          >
            <VStack gap={2} align="stretch">
              <HStack
                justify="space-between"
                py={2}
                px={4}
                bg="gray.50"
                borderRadius="md"
              >
                <Text fontSize="md" color="gray.700">
                  {t("account.totalMedkits")}
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  {medkits?.length || 0}
                </Text>
              </HStack>
              <HStack
                justify="space-between"
                p={3}
                bg="gray.50"
                borderRadius="md"
              >
                <Text fontSize="md" color="gray.700">
                  {t("account.totalMedicines")}
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  {medicines?.length || 0}
                </Text>
              </HStack>
              <HStack
                justify="space-between"
                p={3}
                bg="gray.50"
                borderRadius="md"
              >
                <Text fontSize="md" color="gray.700">
                  {t("account.expiredMedicines")}
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={expiredMedicinesCount > 0 ? "red.600" : "green.600"}
                >
                  {expiredMedicinesCount}
                </Text>
              </HStack>
            </VStack>
          </Box>

          <FormSelect
            label={t("account.language")}
            placeholder={t("account.selectLanguage")}
            options={languageOptions}
            value={i18n.language}
            onChange={handleLanguageChange}
            searchable={false}
          />
        </VStack>
      )}
    </Box>
  );
};
