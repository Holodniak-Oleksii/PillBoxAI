import { useNotificationStore } from "@/app/store/notifications";
import { formatDate } from "@/helpers/date";
import { useMedkits } from "@/services/medkits/hooks";
import { useNotifications } from "@/services/notifications/hooks";
import { INotification } from "@/shared/types/entities";
import {
  DateRange,
  FormDateRangePicker,
  FormSelect,
  ISelectOption,
} from "@/shared/ui-library/fields";
import { Box, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface NotificationFiltersForm {
  medkitId: string | null;
  dateRange: DateRange | null;
}

export const Notifications = () => {
  const { t } = useTranslation();
  const { data: notifications, isLoading } = useNotifications();
  const { data: medkits } = useMedkits();
  const { filters, setMedkitFilter, setDateRangeFilter } =
    useNotificationStore();

  const { control, watch } = useForm<NotificationFiltersForm>({
    mode: "onChange",
    defaultValues: {
      medkitId: filters.medkitId,
      dateRange: filters.dateRange,
    },
  });

  const formValues = watch();

  // Sync form changes to store
  useEffect(() => {
    if (formValues.medkitId !== filters.medkitId) {
      setMedkitFilter(formValues.medkitId);
    }
  }, [formValues.medkitId, filters.medkitId, setMedkitFilter]);

  useEffect(() => {
    if (
      formValues.dateRange?.startDate !== filters.dateRange?.startDate ||
      formValues.dateRange?.endDate !== filters.dateRange?.endDate
    ) {
      setDateRangeFilter(formValues.dateRange);
    }
  }, [formValues.dateRange, filters.dateRange, setDateRangeFilter]);

  const medkitOptions: ISelectOption[] = useMemo(() => {
    if (!medkits) return [];
    return [
      { value: "", label: t("notifications.allMedkits") || "All Medkits" },
      ...medkits.map((medkit) => ({
        value: medkit.id,
        label: medkit.name,
      })),
    ];
  }, [medkits, t]);

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];

    return notifications.filter((notification: INotification) => {
      // Filter by medkit (assuming medicineId relates to medkit somehow)
      if (filters.medkitId) {
        // This is a simplified filter - adjust based on your data structure
        const medkit = medkits?.find((mk) => mk.id === filters.medkitId);
        if (medkit) {
          const hasMedicine = medkit.medicines.some(
            (med) => med.id === notification.medicineId
          );
          if (!hasMedicine) return false;
        }
      }

      // Filter by date range
      if (filters.dateRange?.startDate || filters.dateRange?.endDate) {
        const notificationDate = new Date(notification.ts.createdAt);
        notificationDate.setHours(0, 0, 0, 0);

        if (filters.dateRange.startDate && filters.dateRange.endDate) {
          const startDate = new Date(filters.dateRange.startDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(filters.dateRange.endDate);
          endDate.setHours(23, 59, 59, 999);

          if (notificationDate < startDate || notificationDate > endDate) {
            return false;
          }
        } else if (filters.dateRange.startDate) {
          const startDate = new Date(filters.dateRange.startDate);
          startDate.setHours(0, 0, 0, 0);
          if (notificationDate < startDate) return false;
        }
      }

      return true;
    });
  }, [notifications, filters, medkits]);

  const getNotificationTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      EXPIRY: t("notifications.type.expiry") || "Expiry",
      LOW_STOCK: t("notifications.type.lowStock") || "Low Stock",
      REFILL: t("notifications.type.refill") || "Refill",
    };
    return typeMap[type] || type;
  };

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <HStack gap={4} flexWrap="wrap">
        <Box flex="1" minWidth="200px">
          <Controller
            name="medkitId"
            control={control}
            render={({ field }) => (
              <FormSelect
                label={t("notifications.filter.medkit") || "Medkit"}
                placeholder={
                  t("notifications.filter.selectMedkit") || "Select medkit"
                }
                options={medkitOptions}
                value={field.value || ""}
                onChange={field.onChange}
                searchable={true}
              />
            )}
          />
        </Box>
        <Box flex="1" minWidth="200px">
          <Controller
            name="dateRange"
            control={control}
            render={({ field }) => (
              <FormDateRangePicker
                label={t("labels.date")}
                placeholder={t("placeholders.selectDateRange")}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Box>
      </HStack>
      <Box flex="1" pb={4}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={8}
          >
            <Spinner size="lg" />
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text fontSize="md" fontWeight="bold" mb={1}>
              {t("notifications.noNotifications") || "No notifications found"}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {t("notifications.noNotificationsDescription") ||
                "There are no notifications matching your filters"}
            </Text>
          </Box>
        ) : (
          <VStack gap={3} align="stretch">
            {filteredNotifications.map((notification: INotification) => (
              <Box
                key={notification.id}
                p={4}
                borderWidth={1}
                borderColor={notification.isRead ? "gray.200" : "blue.300"}
                borderRadius="md"
                backgroundColor={notification.isRead ? "white" : "blue.50"}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  borderColor: "blue.400",
                  boxShadow: "sm",
                }}
              >
                <HStack justify="space-between" mb={2}>
                  <HStack gap={2}>
                    {!notification.isRead && (
                      <Box
                        width="8px"
                        height="8px"
                        borderRadius="full"
                        backgroundColor="blue.500"
                      />
                    )}
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color={notification.isRead ? "gray.600" : "blue.600"}
                    >
                      {getNotificationTypeLabel(notification.type)}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    {formatDate(notification.ts.createdAt)}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.700">
                  Medicine ID: {notification.medicineId}
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};
