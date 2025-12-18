import { CRUDModalLayout } from "@/app/layouts/CRUDModalLayout";
import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { useUserStore } from "@/app/store/user";
import { renderFilterField } from "@/features/FilterCreator/renderFields";
import {
  useCreateMedicine,
  useUpdateMedicine,
} from "@/services/medicines/hooks";
import { useMedkit, useMedkitMembers } from "@/services/medkits/hooks";
import { IMedicines, IModalProps, IPillRequest } from "@/shared/types/entities";
import { canEdit, getUserRole } from "@/shared/utils/medkitPermissions";
import { Box, Grid, Text, useBreakpointValue } from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createMedicineFields, createMedicineSchema } from "./data";

interface ICreateMedicineFormValues {
  name: string;
  description?: string;
  quantity: number;
  expiryDate: string;
}

interface ICreateMedicineModalProps extends IModalProps {
  medicine?: IMedicines;
  medkitId?: number;
}

export const CreateMedicineModal = create<ICreateMedicineModalProps>(
  ({ medicine, medkitId }) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const { remove } = useModal();
    const { t } = useTranslation();
    const user = useUserStore((state) => state.user);
    const { mutateAsync: createMedicine, isPending: isCreatePending } =
      useCreateMedicine();
    const { mutateAsync: updateMedicine, isPending: isUpdatePending } =
      useUpdateMedicine();
    const isEditMode = !!medicine;
    const { data: medkit } = useMedkit(String(medkitId), !!medkitId);
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

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ICreateMedicineFormValues>({
      resolver: zodResolver(createMedicineSchema),
      defaultValues: medicine
        ? {
            name: medicine.name,
            description: medicine.description || "",
            quantity: medicine.quantity,
            expiryDate: new Date(medicine.expiryDate)
              .toISOString()
              .split("T")[0],
          }
        : undefined,
    });

    const onSubmit: SubmitHandler<ICreateMedicineFormValues> = async (data) => {
      if (!userCanEdit) {
        return;
      }

      const pillRequest: IPillRequest = {
        name: data.name,
        description: data.description || undefined,
        expiryDate: data.expiryDate,
        quantity: data.quantity,
      };

      if (isEditMode && medicine) {
        await updateMedicine({
          medicineId: medicine.id,
          pill: pillRequest,
        });
      } else if (medkitId && user?.id) {
        await createMedicine({
          medkitId,
          createdById: user.id,
          pill: pillRequest,
        });
      }
      remove();
    };

    // Show error message if user doesn't have permission
    if (!userCanEdit && medkitId) {
      return (
        <ModalLayout maxWidth={760}>
          <CRUDModalLayout
            onSubmit={() => remove()}
            title={
              isEditMode
                ? t("modals.editMedicine.title")
                : t("modals.createMedicine.title")
            }
          >
            <Box p={4}>
              <Text color="red.500" textAlign="center">
                {t("modals.createMedicine.errors.noPermission")}
              </Text>
            </Box>
          </CRUDModalLayout>
        </ModalLayout>
      );
    }

    const renderFields = (start: number, end: number) =>
      createMedicineFields.slice(start, end).map((field) => (
        <div key={field.name}>
          {renderFilterField<ICreateMedicineFormValues>({
            field: {
              ...field,
              label: t(field.label),
              placeholder: field.placeholder ? t(field.placeholder) : "",
            },
            control,
            error:
              errors[field.name as keyof ICreateMedicineFormValues]?.message,
          })}
        </div>
      ));

    return (
      <ModalLayout maxWidth={760}>
        <CRUDModalLayout
          disabled={isUpdatePending || isCreatePending}
          onSubmit={handleSubmit(onSubmit)}
          title={
            isEditMode
              ? t("modals.editMedicine.title")
              : t("modals.createMedicine.title")
          }
        >
          <Grid templateColumns="1fr 1fr" gap={6} w="100%">
            {isMobile ? (
              <Box>{renderFields(0, 4)}</Box>
            ) : (
              <>
                <Box>{renderFields(0, 2)}</Box>
                <Box>{renderFields(2, 4)}</Box>
              </>
            )}
          </Grid>
        </CRUDModalLayout>
      </ModalLayout>
    );
  }
);
