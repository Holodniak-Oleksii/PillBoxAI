import { Button, Field, HStack, Popover, Text, VStack } from "@chakra-ui/react";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  LuCalendar,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface FormDateRangePickerProps {
  label: string;
  placeholder?: string;
  value?: DateRange | null;
  onChange: (range: DateRange | null) => void;
  error?: string;
  required?: boolean;
}

const DAYS_OF_WEEK = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const FormDateRangePicker = forwardRef<
  HTMLDivElement,
  FormDateRangePickerProps
>(
  (
    {
      label,
      placeholder = "Select date range",
      value,
      onChange,
      error,
      required = false,
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [popoverWidth, setPopoverWidth] = useState<number | string>("100%");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (isOpen && triggerRef.current) {
        setPopoverWidth(triggerRef.current.offsetWidth);
      }
    }, [isOpen]);

    useEffect(() => {
      if (value?.startDate) {
        setCurrentMonth(new Date(value.startDate));
      }
    }, [value]);

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek =
        firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

      return { daysInMonth, startingDayOfWeek };
    };

    const isDateInRange = (date: Date) => {
      if (!value?.startDate || !value?.endDate) return false;
      return date >= value.startDate && date <= value.endDate;
    };

    const isDateStart = (date: Date) => {
      if (!value?.startDate) return false;
      return (
        date.getDate() === value.startDate.getDate() &&
        date.getMonth() === value.startDate.getMonth() &&
        date.getFullYear() === value.startDate.getFullYear()
      );
    };

    const isDateEnd = (date: Date) => {
      if (!value?.endDate) return false;
      return (
        date.getDate() === value.endDate.getDate() &&
        date.getMonth() === value.endDate.getMonth() &&
        date.getFullYear() === value.endDate.getFullYear()
      );
    };

    const isDateHoveredInRange = (date: Date) => {
      if (!value?.startDate || !hoveredDate || value?.endDate) return false;
      return (
        date >= value.startDate &&
        date <= hoveredDate &&
        date > value.startDate &&
        date < hoveredDate
      );
    };

    const handleDateClick = (date: Date) => {
      if (!value?.startDate || (value.startDate && value.endDate)) {
        onChange({ startDate: date, endDate: null });
      } else if (value.startDate && !value.endDate) {
        if (date < value.startDate) {
          onChange({ startDate: date, endDate: value.startDate });
        } else {
          onChange({ startDate: value.startDate, endDate: date });
        }
      }
    };

    const handleClear = () => {
      onChange(null);
    };

    const navigateMonth = (direction: "prev" | "next") => {
      setCurrentMonth((prev) => {
        const newDate = new Date(prev);
        if (direction === "prev") {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
        return newDate;
      });
    };

    const formatDateRange = () => {
      if (!value?.startDate) return placeholder;
      if (!value.endDate) {
        return `${value.startDate.toLocaleDateString()} - ...`;
      }
      return `${value.startDate.toLocaleDateString()} - ${value.endDate.toLocaleDateString()}`;
    };

    const calendarDays = useMemo(() => {
      const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
      const days: (Date | null)[] = [];

      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        days.push(
          new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
        );
      }

      return days;
    }, [currentMonth]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <Field.Root invalid={!!error} ref={ref} gap={0.5} required={required}>
        <Field.Label>{label}</Field.Label>
        <div style={{ position: "relative", width: "100%" }}>
          <Popover.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
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
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: value?.startDate ? "#1a202c" : "#a0aec0",
                  }}
                >
                  <LuCalendar style={{ fontSize: "16px" }} />
                  {formatDateRange()}
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
              <Popover.Body p={4}>
                <VStack gap={3} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth("prev")}
                      style={{ padding: "4px 8px" }}
                    >
                      <LuChevronLeft style={{ fontSize: "16px" }} />
                    </Button>
                    <Text fontSize="md" fontWeight="semibold">
                      {MONTHS[currentMonth.getMonth()]}{" "}
                      {currentMonth.getFullYear()}
                    </Text>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth("next")}
                      style={{ padding: "4px 8px" }}
                    >
                      <LuChevronRight style={{ fontSize: "16px" }} />
                    </Button>
                  </HStack>

                  <HStack gap={1} justify="space-between">
                    {DAYS_OF_WEEK.map((day) => (
                      <Text
                        key={day}
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.500"
                        width="32px"
                        textAlign="center"
                      >
                        {day}
                      </Text>
                    ))}
                  </HStack>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "4px",
                    }}
                  >
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return (
                          <div
                            key={`empty-${index}`}
                            style={{ height: "32px" }}
                          />
                        );
                      }

                      const isToday =
                        date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();

                      const isOtherMonth =
                        date.getMonth() !== currentMonth.getMonth();
                      const isStart = isDateStart(date);
                      const isEnd = isDateEnd(date);
                      const inRange = isDateInRange(date);
                      const inHoverRange = isDateHoveredInRange(date);

                      return (
                        <button
                          key={`${date.getTime()}`}
                          type="button"
                          onClick={() => handleDateClick(date)}
                          onMouseEnter={(e) => {
                            if (value?.startDate && !value?.endDate) {
                              setHoveredDate(date);
                            }
                            if (
                              !isStart &&
                              !isEnd &&
                              !inRange &&
                              !inHoverRange
                            ) {
                              e.currentTarget.style.backgroundColor = "#f7fafc";
                            }
                          }}
                          onMouseLeave={(e) => {
                            setHoveredDate(null);
                            if (
                              !isStart &&
                              !isEnd &&
                              !inRange &&
                              !inHoverRange
                            ) {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }
                          }}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: isStart || isEnd ? 600 : 400,
                            backgroundColor:
                              isStart || isEnd
                                ? "#3182ce"
                                : inRange || inHoverRange
                                ? "#e6f2ff"
                                : "transparent",
                            color:
                              isStart || isEnd
                                ? "white"
                                : isOtherMonth
                                ? "#cbd5e0"
                                : inRange || inHoverRange
                                ? "#3182ce"
                                : isToday
                                ? "#3182ce"
                                : "#4a5568",
                            transition: "all 0.15s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  <HStack
                    justify="space-between"
                    pt={2}
                    borderTop="1px solid #e2e8f0"
                  >
                    {value?.startDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        style={{
                          fontSize: "12px",
                          padding: "4px 12px",
                        }}
                      >
                        {t("button.clear") || "Clear"}
                      </Button>
                    )}
                    <Button
                      variant="solid"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      style={{
                        fontSize: "12px",
                        padding: "4px 12px",
                        marginLeft: "auto",
                      }}
                    >
                      {t("button.apply") || "Apply"}
                    </Button>
                  </HStack>
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

FormDateRangePicker.displayName = "FormDateRangePicker";
