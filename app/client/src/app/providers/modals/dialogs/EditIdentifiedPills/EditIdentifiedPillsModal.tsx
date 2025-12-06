import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { useUserStore } from "@/app/store/user";
import { renderFilterField } from "@/features/FilterCreator/renderFields";
import { EFilterFieldType } from "@/features/FilterCreator/types";
import { useCreateMedicine } from "@/services/medicines/hooks";
import {
  IIdentifiedPill,
  IModalProps,
  IPillRequest,
} from "@/shared/types/entities";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FieldArrayWithId, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { createMedicineSchema } from "../CreateMedecine/data";

interface IEditIdentifiedPillsModalProps extends IModalProps {
  identifiedPills: IIdentifiedPill[];
  medkitId?: number;
}

interface IEditablePillFormValues {
  name: string;
  description?: string;
  quantity: number;
  expiryDate: string;
}

interface IPillsFormData {
  pills: IEditablePillFormValues[];
}

const pillsArraySchema = z.object({
  pills: z.array(createMedicineSchema),
});

export const EditIdentifiedPillsModal = create<IEditIdentifiedPillsModalProps>(
  ({ identifiedPills, medkitId }) => {
    const { remove } = useModal();
    const { t } = useTranslation();
    const user = useUserStore((state) => state.user);
    const { mutateAsync: createMedicine } = useCreateMedicine();

    const defaultExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const defaultValues: IPillsFormData = {
      pills: identifiedPills.map((pill) => ({
        name: pill.name,
        description: pill.description || "",
        quantity: pill.quantity || 1,
        expiryDate: pill.expiryDate || defaultExpiryDate,
      })),
    };

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<IPillsFormData>({
      resolver: zodResolver(pillsArraySchema),
      defaultValues,
    });

    const { fields, remove: removeField } = useFieldArray({
      control,
      name: "pills",
    });

    const [savingIndex, setSavingIndex] = React.useState<number | null>(null);

    const handleSavePill = async (
      index: number,
      data: IEditablePillFormValues
    ) => {
      if (!medkitId || !user?.id) return;

      try {
        setSavingIndex(index);
        const pillRequest: IPillRequest = {
          name: data.name,
          description: data.description || undefined,
          expiryDate: data.expiryDate,
          quantity: data.quantity,
        };

        await createMedicine({
          medkitId,
          createdById: user.id,
          pill: pillRequest,
        });

        // Remove saved pill from list
        removeField(index);
      } catch (error) {
        console.error("Error creating medicine:", error);
      } finally {
        setSavingIndex(null);
      }
    };

    const handleSaveAll = async (data: IPillsFormData) => {
      if (!medkitId || !user?.id) return;

      for (let i = data.pills.length - 1; i >= 0; i--) {
        const pill = data.pills[i];
        const pillRequest: IPillRequest = {
          name: pill.name,
          description: pill.description || undefined,
          expiryDate: pill.expiryDate,
          quantity: pill.quantity,
        };

        try {
          await createMedicine({
            medkitId,
            createdById: user.id,
            pill: pillRequest,
          });
          removeField(i);
        } catch (error) {
          console.error(`Error creating medicine ${i}:`, error);
        }
      }
    };

    const renderPillForm = (
      field: FieldArrayWithId<IPillsFormData, "pills", "id">,
      index: number
    ) => {
      const fieldErrors = errors.pills?.[index];

      return (
        <Box
          key={field.id}
          p={4}
          borderWidth={1}
          borderColor="gray.200"
          borderRadius="md"
          bg="gray.50"
          position="relative"
        >
          <CloseButton
            position="absolute"
            top={0}
            right={0}
            size="sm"
            onClick={() => removeField(index)}
          />

          <VStack gap={3} align="stretch">
            {renderFilterField<IPillsFormData>({
              field: {
                name: `pills.${index}.name` as `pills.${number}.name`,
                label: t("labels.medicineName"),
                type: EFilterFieldType.TEXT,
                placeholder: t("placeholders.medicineName"),
                required: true,
                inputType: "text",
              },
              control,
              error: fieldErrors?.name?.message,
            })}

            {renderFilterField<IPillsFormData>({
              field: {
                name: `pills.${index}.description` as `pills.${number}.description`,
                label: t("labels.description"),
                type: EFilterFieldType.TEXTAREA,
                placeholder: t("placeholders.description"),
                required: false,
                rows: 4,
              },
              control,
              error: fieldErrors?.description?.message,
            })}

            <Flex gap={3}>
              {renderFilterField<IPillsFormData>({
                field: {
                  name: `pills.${index}.quantity` as `pills.${number}.quantity`,
                  label: t("labels.quantity"),
                  type: EFilterFieldType.NUMBER,
                  placeholder: t("placeholders.quantity"),
                  required: true,
                  min: 0,
                },
                control,
                error: fieldErrors?.quantity?.message,
              })}

              {renderFilterField<IPillsFormData>({
                field: {
                  name: `pills.${index}.expiryDate` as `pills.${number}.expiryDate`,
                  label: t("labels.expiryDate"),
                  type: EFilterFieldType.DATE,
                  placeholder: t("placeholders.expiryDate"),
                  required: true,
                },
                control,
                error: fieldErrors?.expiryDate?.message,
              })}
            </Flex>

            <Button
              onClick={handleSubmit((data) =>
                handleSavePill(index, data.pills[index])
              )}
              disabled={savingIndex !== null && savingIndex !== index}
              w="fit-content"
            >
              {savingIndex === index ? t("button.saving") : t("button.save")}
            </Button>
          </VStack>
        </Box>
      );
    };

    useEffect(() => {
      if (fields.length === 0) {
        setTimeout(() => remove(), 500);
      }
    }, [fields.length, remove]);

    return (
      <ModalLayout maxWidth={680}>
        <Box>
          <Dialog.Header
            p={4}
            position={"relative"}
            borderBottomWidth={1}
            borderColor="gray.200"
          >
            <Dialog.Title fontSize={"xl"}>
              {t("modals.editIdentifiedPills.title")}
            </Dialog.Title>
            <CloseButton
              position={"absolute"}
              right={2}
              top={2}
              onClick={remove}
            />
          </Dialog.Header>
          <Dialog.Body p={4}>
            <Box maxH="60vh" overflowY="auto">
              <VStack gap={4} align="stretch">
                {fields.length === 0 ? (
                  <Text textAlign="center" color="gray.500" py={8}>
                    {t("modals.editIdentifiedPills.allSaved")}
                  </Text>
                ) : (
                  fields.map((field, index) => renderPillForm(field, index))
                )}
              </VStack>
            </Box>
          </Dialog.Body>
          <Dialog.Footer
            justifyContent={"space-between"}
            gap={2}
            borderTopWidth={1}
            borderColor="gray.200"
            p={4}
          >
            <Button variant="outline" type="button" onClick={remove}>
              {t("button.cancel")}
            </Button>
            <Flex gap={2} align="center">
              <Button
                onClick={handleSubmit(handleSaveAll)}
                disabled={fields.length === 0 || savingIndex !== null}
              >
                {t("modals.editIdentifiedPills.saveAll")}
              </Button>
              <Text fontSize="sm" color="gray.600">
                {fields.length} {t("modals.editIdentifiedPills.remaining")}
              </Text>
            </Flex>
          </Dialog.Footer>
        </Box>
      </ModalLayout>
    );
  }
);
