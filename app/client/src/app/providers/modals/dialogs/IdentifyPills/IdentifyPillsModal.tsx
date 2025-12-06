import { ModalLayout } from "@/app/layouts/ModalLayout/ModalLayout";
import { useIdentifyPills } from "@/services/ai/hooks";
import { IModalProps } from "@/shared/types/entities";
import { EModalKey } from "@/shared/types/enums";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import NiceModal, { create, useModal } from "@ebay/nice-modal-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface IIdentifyPillsModalProps extends IModalProps {
  medkitId?: number;
}

export const IdentifyPillsModal = create<IIdentifyPillsModalProps>(
  ({ medkitId }) => {
    const { remove } = useModal();
    const { t, i18n } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const { mutateAsync: identifyPills, isPending } = useIdentifyPills();

    const handleFileSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);

        // Create previews
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
      },
      [selectedFiles, previews]
    );

    const removeFile = useCallback(
      (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
      },
      [selectedFiles, previews]
    );

    const handleIdentify = async () => {
      if (selectedFiles.length === 0) return;

      try {
        const identifiedPills = await identifyPills({
          images: selectedFiles,
          language: i18n.language,
        });

        // Open edit modal with identified pills
        remove();
        NiceModal.show(EModalKey.EDIT_IDENTIFIED_PILLS, {
          identifiedPills,
          medkitId,
        });
      } catch (error) {
        console.error("Error identifying pills:", error);
      }
    };

    return (
      <ModalLayout maxWidth={600}>
        <Box as="form">
          <Dialog.Header
            p={4}
            position={"relative"}
            borderBottomWidth={1}
            borderColor="gray.200"
          >
            <Dialog.Title fontSize={"xl"}>
              {t("modals.identifyPills.title")}
            </Dialog.Title>
            <CloseButton
              position={"absolute"}
              right={2}
              top={2}
              onClick={remove}
            />
          </Dialog.Header>
          <Dialog.Body p={4}>
            <VStack gap={4} align="stretch">
              <Box>
                <Text mb={2} fontSize="sm" color="gray.600">
                  {t("modals.identifyPills.description")}
                </Text>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button as="span" variant="outline" w="100%" cursor="pointer">
                    {t("modals.identifyPills.selectImages")}
                  </Button>
                </label>
              </Box>

              {previews.length > 0 && (
                <Box>
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    {t("modals.identifyPills.selectedImages")} (
                    {previews.length})
                  </Text>
                  <Flex gap={2} flexWrap="wrap">
                    {previews.map((preview, index) => (
                      <Box
                        key={index}
                        position="relative"
                        borderWidth={1}
                        borderColor="gray.200"
                        borderRadius="md"
                        overflow="hidden"
                        w="100px"
                        h="100px"
                      >
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                        <CloseButton
                          position="absolute"
                          top={1}
                          right={1}
                          size="sm"
                          bg="whiteAlpha.800"
                          onClick={() => removeFile(index)}
                        />
                      </Box>
                    ))}
                  </Flex>
                </Box>
              )}
            </VStack>
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
            <Button
              type="button"
              onClick={handleIdentify}
              disabled={selectedFiles.length === 0 || isPending}
            >
              {isPending
                ? t("modals.identifyPills.identifying")
                : t("modals.identifyPills.identify")}
            </Button>
          </Dialog.Footer>
        </Box>
      </ModalLayout>
    );
  }
);
