import { useMedkits } from "@/services/medkits/hooks";
import { Button, Popover, Portal, Text, VStack } from "@chakra-ui/react";
import { FC, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuChevronDown } from "react-icons/lu";

interface IMedkitSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const MedkitSelect: FC<IMedkitSelectProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const { data: medkits = [] } = useMedkits();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const medkitOptions = useMemo(() => {
    return medkits.map((medkit) => ({
      value: String(medkit.id),
      label: medkit.name,
    }));
  }, [medkits]);

  const selectedMedkit = useMemo(
    () => medkitOptions.find((opt) => opt.value === value),
    [medkitOptions, value]
  );

  const handleMedkitSelect = (selectedValue: string) => {
    onChange(selectedValue === value ? null : selectedValue);
    setIsSelectOpen(false);
  };

  return (
    <Popover.Root
      open={isSelectOpen}
      onOpenChange={(e) => setIsSelectOpen(e.open)}
    >
      <Popover.Trigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          borderRadius="3xl"
          size="md"
          fontSize="sm"
          p={4}
          minW={160}
        >
          <Text>
            {selectedMedkit
              ? selectedMedkit.label
              : t("notifications.filter.selectMedkit")}
          </Text>
          <LuChevronDown
            style={{
              marginLeft: "auto",
              transform: isSelectOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            width={triggerRef.current?.offsetWidth || 200}
            zIndex={1000}
          >
            <Popover.Body p={2}>
              <VStack
                gap={1}
                align="stretch"
                maxHeight="200px"
                overflowY="auto"
                css={{
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-track": { bg: "transparent" },
                  "&::-webkit-scrollbar-thumb": {
                    bg: "#cbd5e0",
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    bg: "#a0aec0",
                  },
                }}
              >
                {medkitOptions.length === 0 ? (
                  <Text fontSize="sm" color="gray.500" p={2} textAlign="center">
                    {t("notifications.noOptions") || "No options found"}
                  </Text>
                ) : (
                  medkitOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleMedkitSelect(option.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        textAlign: "left",
                        cursor: "pointer",
                        backgroundColor:
                          option.value === value ? "#edf2f7" : "transparent",
                        border: "none",
                        width: "100%",
                        fontSize: "13px",
                        color: option.value === value ? "#2d3748" : "#4a5568",
                        fontWeight: option.value === value ? 500 : 400,
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (option.value !== value) {
                          e.currentTarget.style.backgroundColor = "#f7fafc";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (option.value !== value) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  ))
                )}
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
