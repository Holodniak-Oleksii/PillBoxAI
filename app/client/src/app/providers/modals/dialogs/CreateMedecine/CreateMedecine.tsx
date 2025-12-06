import { CRUDModalLayout } from "@/app/layouts/CRUDModalLayout";
import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { useUserStore } from "@/app/store/user";
import { renderFilterField } from "@/features/FilterCreator/renderFields";
import {
  useCreateMedicine,
  useUpdateMedicine,
} from "@/services/medicines/hooks";
import { IMedicines, IModalProps, IPillRequest } from "@/shared/types/entities";
import { Box, Grid } from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createMedicineFields, createMedicineSchema } from "./data";

interface ICreateMedicineFormValues {
  name: string;
  activeSubstance?: string;
  description?: string;
  usageInstructions?: string;
  sideEffects?: string;
  contraindications?: string;
  quantity: number;
  expiryDate: string;
}

interface ICreateMedicineModalProps extends IModalProps {
  medicine?: IMedicines;
  medkitId?: number;
}

export const CreateMedicineModal = create<ICreateMedicineModalProps>(
  ({ medicine, medkitId }) => {
    const { remove } = useModal();
    const { t } = useTranslation();
    const user = useUserStore((state) => state.user);
    const { mutateAsync: createMedicine } = useCreateMedicine();
    const { mutateAsync: updateMedicine } = useUpdateMedicine();
    const isEditMode = !!medicine;

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ICreateMedicineFormValues>({
      resolver: zodResolver(createMedicineSchema),
      defaultValues: medicine
        ? {
            name: medicine.name,
            activeSubstance: medicine.activeSubstance || "",
            description: medicine.description || "",
            usageInstructions: medicine.usageInstructions || "",
            sideEffects: medicine.sideEffects || "",
            contraindications: medicine.contraindications || "",
            quantity: medicine.quantity,
            expiryDate: new Date(medicine.expiryDate)
              .toISOString()
              .split("T")[0],
          }
        : undefined,
    });

    const onSubmit: SubmitHandler<ICreateMedicineFormValues> = async (data) => {
      const pillRequest: IPillRequest = {
        name: data.name,
        activeSubstance: data.activeSubstance || undefined,
        description: data.description || undefined,
        usageInstructions: data.usageInstructions || undefined,
        sideEffects: data.sideEffects || undefined,
        contraindications: data.contraindications || undefined,
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
          onSubmit={handleSubmit(onSubmit)}
          title={
            isEditMode
              ? t("modals.editMedicine.title")
              : t("modals.createMedicine.title")
          }
        >
          <Grid templateColumns="1fr 1fr" gap={6} w="100%">
            <Box>{renderFields(0, 5)}</Box>
            <Box>{renderFields(5, 8)}</Box>
          </Grid>
        </CRUDModalLayout>
      </ModalLayout>
    );
  }
);
