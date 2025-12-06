import { CRUDModalLayout } from "@/app/layouts/CRUDModalLayout";
import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { renderFilterField } from "@/features/FilterCreator";
import { useCreateMedkit, useUpdateMedkit } from "@/services/medkits/hooks";
import { IModalProps } from "@/shared/types/entities";
import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createMedkitFields, createMedkitSchema } from "./data";

interface ICreateMedkitFormValues {
  name: string;
  description?: string;
}

interface ICreateMedkitModalProps extends IModalProps {
  defaultValues?: ICreateMedkitFormValues;
  medkitId?: number;
}

export const CreateMedkitModal = create<ICreateMedkitModalProps>(
  ({ defaultValues, medkitId }) => {
    const { remove } = useModal();
    const { t } = useTranslation();
    const { mutateAsync: createMedkit } = useCreateMedkit();
    const { mutateAsync: updateMedkit } = useUpdateMedkit();

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ICreateMedkitFormValues>({
      defaultValues,
      resolver: zodResolver(createMedkitSchema),
    });

    const onSubmit: SubmitHandler<ICreateMedkitFormValues> = async (data) => {
      if (defaultValues) {
        await updateMedkit({
          medkitId,
          medkit: data,
        });
      } else {
        await createMedkit(data);
      }
      remove();
    };

    return (
      <ModalLayout maxWidth={"400px"}>
        <CRUDModalLayout
          onSubmit={handleSubmit(onSubmit)}
          title={t("modals.createMedkit.title")}
        >
          {createMedkitFields.map((field) =>
            renderFilterField<ICreateMedkitFormValues>({
              field: {
                ...field,
                label: t(field.label),
                placeholder: t(field.placeholder || ""),
              },
              control,
              error:
                errors[field.name as keyof ICreateMedkitFormValues]?.message,
            })
          )}
        </CRUDModalLayout>
      </ModalLayout>
    );
  }
);
