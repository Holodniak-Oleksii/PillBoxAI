import { Field, Input, Popover, Text, VStack } from "@chakra-ui/react";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { LuChevronDown } from "react-icons/lu";

export interface ISelectOption {
  value: string | number;
  label: string;
}

export interface FormSelectProps {
  label: string;
  placeholder: string;
  options: ISelectOption[];
  value?: string | null;
  onChange: (value: string | number | null) => void;
  error?: string;
  required?: boolean;
  searchable?: boolean;
}

export const FormSelect = forwardRef<HTMLDivElement, FormSelectProps>(
  (
    {
      label,
      placeholder,
      options,
      value,
      onChange,
      error,
      required = false,
      searchable = true,
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [popoverWidth, setPopoverWidth] = useState<number | string>("100%");
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (isOpen && triggerRef.current) {
        setPopoverWidth(triggerRef.current.offsetWidth);
      }
    }, [isOpen]);

    const filteredOptions = useMemo(() => {
      if (!searchable || !searchQuery.trim()) {
        return options;
      }

      const query = searchQuery.toLowerCase();
      return options.filter((option) =>
        option.label.toLowerCase().includes(query)
      );
    }, [options, searchQuery, searchable]);

    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value]
    );

    const handleSelect = (selectedValue: string | number) => {
      if (selectedValue === value) {
        onChange(null);
      } else {
        onChange(selectedValue);
      }
      setIsOpen(false);
      setSearchQuery("");
    };

    return (
      <Field.Root invalid={!!error} ref={ref} gap={0.5} required={required}>
        <Field.Label>{label}</Field.Label>
        <div style={{ position: "relative", width: "100%" }}>
          <Popover.Root
            positioning={{ placement: "top-end" }}
            open={isOpen}
            onOpenChange={(e) => setIsOpen(e.open)}
          >
            <Popover.Trigger asChild>
              <button
                ref={triggerRef}
                type="button"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: error ? "1px solid #e53e3e" : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                  minHeight: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setIsOpen(!isOpen)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = error
                    ? "#e53e3e"
                    : "#3182ce";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 1px rgba(66, 153, 225, 0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = error
                    ? "#e53e3e"
                    : "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ color: selectedOption ? "#1a202c" : "#a0aec0" }}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                <LuChevronDown
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    fontSize: "18px",
                    color: "#718096",
                    flexShrink: 0,
                  }}
                />
              </button>
            </Popover.Trigger>
            <Popover.Content
              width={popoverWidth}
              zIndex={1000}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "4px",
              }}
            >
              <Popover.Body p={2}>
                {searchable && (
                  <Input
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="sm"
                    mb={2}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (filteredOptions.length > 0) {
                          handleSelect(filteredOptions[0].value);
                        }
                      }
                    }}
                  />
                )}
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
                  {filteredOptions.length === 0 ? (
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      p={2}
                      textAlign="center"
                    >
                      {t("notifications.noOptions") || "No options found"}
                    </Text>
                  ) : (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "6px",
                          textAlign: "left",
                          cursor: "pointer",
                          backgroundColor:
                            option.value === value ? "#edf2f7" : "transparent",
                          border: "none",
                          width: "100%",
                          fontSize: "14px",
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
                            e.currentTarget.style.backgroundColor =
                              "transparent";
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
          </Popover.Root>
        </div>
        {error ? (
          <Field.ErrorText width={"100%"} justifyContent={"end"}>
            {t(error)}
          </Field.ErrorText>
        ) : (
          <Field.HelperText>&nbsp;</Field.HelperText>
        )}
      </Field.Root>
    );
  }
);

FormSelect.displayName = "FormSelect";
