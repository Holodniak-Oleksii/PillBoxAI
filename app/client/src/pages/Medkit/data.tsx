import { EFilterFieldType, IFilterField } from "@/features/FilterCreator";
import { IMedicines } from "@/shared/types/entities";
import { IconButton } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { BiEdit } from "react-icons/bi";
import { LuTrash2 } from "react-icons/lu";

export const getColumns = (
  t: TFunction,
  onEdit: (medicine: IMedicines) => void,
  onDelete: (medicine: IMedicines) => void
): ColumnDef<IMedicines>[] => [
  {
    accessorKey: "name",
    header: t("medkit.table.name"),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "quantity",
    header: t("medkit.table.quantity"),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "expiryDate",
    header: t("medkit.table.expiryDate"),
    cell: (info) => {
      const date = info.getValue() as Date;
      return new Date(date).toLocaleDateString("uk-UA");
    },
  },
  {
    accessorKey: "description",
    header: t("medkit.table.description"),
    cell: (info) => {
      const text = info.getValue() as string;
      return text?.length > 50 ? `${text.substring(0, 50)}...` : text;
    },
  },
  {
    accessorKey: "createdAt",
    header: t("medkit.table.createdAt"),
    cell: (info) => {
      const date = info.getValue() as Date;
      return new Date(date).toLocaleDateString("uk-UA");
    },
  },
  {
    id: "actions",
    header: t("medkit.table.actions"),
    cell: (info) => {
      const medicine = info.row.original;
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          <IconButton
            aria-label={t("medkit.actions.edit")}
            size="md"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(medicine);
            }}
          >
            <BiEdit />
          </IconButton>
          <IconButton
            aria-label={t("medkit.actions.delete")}
            size="md"
            variant="ghost"
            colorPalette="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(medicine);
            }}
          >
            <LuTrash2 />
          </IconButton>
        </div>
      );
    },
  },
];

export const getFilterConfig = (t: TFunction): IFilterField[] => [
  {
    name: "search",
    label: t("medkit.filters.search"),
    type: EFilterFieldType.TEXT,
    placeholder: t("medkit.filters.searchByName"),
    defaultValue: "",
  },
];
