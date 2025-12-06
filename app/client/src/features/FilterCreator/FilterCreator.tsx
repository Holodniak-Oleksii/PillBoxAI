import { useFilterStore } from "@/app/store/filters";
import { Grid } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { renderFilterField } from "./renderFields";
import { IFilterCreatorProps, TFilterValues } from "./types";
import { createFilterSchema } from "./validation";

const DEBOUNCE_DELAY = 500;

export const FilterCreator = <T extends TFilterValues = TFilterValues>({
  tableName,
  config,
  onSubmit,
}: IFilterCreatorProps<T>) => {
  const { getFilters, setFilters } = useFilterStore();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const defaultValues: TFilterValues = config.reduce((acc, field) => {
    acc[field.name] = field.defaultValue;
    return acc;
  }, {} as TFilterValues);

  const schema = createFilterSchema(config);

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TFilterValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    const savedFilters = getFilters(tableName);
    if (savedFilters && Object.keys(savedFilters).length > 0) {
      Object.entries(savedFilters).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [tableName, getFilters, setValue]);

  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setFilters(tableName, values as TFilterValues);
        onSubmit?.(values as T);
      }, DEBOUNCE_DELAY);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [watch, tableName, setFilters, onSubmit]);

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={4}
    >
      {config.map((field) => (
        <div key={field.name}>
          {renderFilterField({
            field,
            control,
            error: errors[field.name]?.message as string | undefined,
          })}
        </div>
      ))}
    </Grid>
  );
};
