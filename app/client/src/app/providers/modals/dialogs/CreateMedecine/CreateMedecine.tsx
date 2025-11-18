import { CRUDModalLayout } from "@/app/layouts/CRUDModalLayout";
import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { renderFilterField } from "@/features/FilterCreator/renderFields";
import { IMedicines, IModalProps } from "@/shared/types/entities";
import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createMedicineFields, createMedicineSchema } from "./data";

interface ICreateMedicineFormValues {
  name: string;
  activeIngredient: string;
  description: string;
  usageInstructions: string;
  sideEffects: string;
  contraindications: string;
  storageConditions: string;
  quantity: number;
  expiryDate: string;
}

interface ICreateMedicineModalProps extends IModalProps {
  medicine?: IMedicines;
  medkitId?: string;
  onSuccess?: (medicine: IMedicines) => void;
}

export const CreateMedicineModal = create<ICreateMedicineModalProps>(
  ({ medicine, medkitId, onSuccess }) => {
    const { remove } = useModal();
    const { t } = useTranslation();
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
            activeIngredient: medicine.activeIngredient,
            description: medicine.description,
            usageInstructions: medicine.usageInstructions,
            sideEffects: medicine.sideEffects,
            contraindications: medicine.contraindications,
            storageConditions: medicine.storageConditions,
            quantity: medicine.quantity,
            expiryDate: new Date(medicine.expiryDate)
              .toISOString()
              .split("T")[0],
          }
        : undefined,
    });

    const onSubmit: SubmitHandler<ICreateMedicineFormValues> = async (data) => {
      const medicineData: IMedicines = {
        id: medicine?.id || `temp-${Date.now()}`,
        name: data.name,
        activeIngredient: data.activeIngredient,
        description: data.description || "",
        usageInstructions: data.usageInstructions || "",
        sideEffects: data.sideEffects || "",
        contraindications: data.contraindications || "",
        storageConditions: data.storageConditions || "",
        quantity: data.quantity,
        medkitId: medkitId || medicine?.medkitId || "",
        expiryDate: new Date(data.expiryDate),
        ts: medicine?.ts || {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      if (onSuccess) {
        onSuccess(medicineData);
      }
      remove();
    };

    const renderFields = () =>
      createMedicineFields.map((field) => (
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
      <ModalLayout maxWidth={500}>
        <CRUDModalLayout
          onSubmit={handleSubmit(onSubmit)}
          title={
            isEditMode
              ? t("modals.editMedicine.title")
              : t("modals.createMedicine.title")
          }
        >
          {renderFields()}
        </CRUDModalLayout>
      </ModalLayout>
    );
  }
);
