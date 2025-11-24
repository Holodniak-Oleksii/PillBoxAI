import { CRUDModalLayout } from "@/app/layouts/CRUDModalLayout";
import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { useCreateMedkit } from "@/services/medkits/hooks";
import { IMedkit, IModalProps } from "@/shared/types/entities";
import { FormInput } from "@/shared/ui-library/fields";
import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

interface ICreateMedkitFormValues {
  name: string;
}

const createMedkitSchema = z.object({
  name: z
    .string({ error: "errors.isRequired" })
    .min(1, "errors.isRequired")
    .min(2, "errors.minLength"),
});

export const CreateMedkitModal = create<IModalProps>(() => {
  const modal = useModal();
  const { t } = useTranslation();
  const { mutate: createMedkit } = useCreateMedkit();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateMedkitFormValues>({
    resolver: zodResolver(createMedkitSchema),
  });

  const onSubmit: SubmitHandler<ICreateMedkitFormValues> = async (data) => {
    createMedkit(data as IMedkit);
    modal.remove();
  };

  return (
    <ModalLayout maxWidth={"400px"}>
      <CRUDModalLayout
        onSubmit={handleSubmit(onSubmit)}
        title={t("modals.createMedkit.title")}
      >
        <FormInput
          label={t("labels.title")}
          placeholder={t("placeholders.title")}
          type="text"
          autoComplete="name"
          name="name"
          control={control}
          error={errors.name?.message}
        />
      </CRUDModalLayout>
    </ModalLayout>
  );
});
