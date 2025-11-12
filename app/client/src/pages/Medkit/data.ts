import { IMedicines } from "@/shared/types/entities";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<IMedicines>[] = [
  {
    accessorKey: "name",
    header: "Назва",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "activeIngredient",
    header: "Активна речовина",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "quantity",
    header: "Кількість",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "expiryDate",
    header: "Термін придатності",
    cell: (info) => {
      const date = info.getValue() as Date;
      return new Date(date).toLocaleDateString("uk-UA");
    },
  },
  {
    accessorKey: "description",
    header: "Опис",
    cell: (info) => {
      const text = info.getValue() as string;
      return text?.length > 50 ? `${text.substring(0, 50)}...` : text;
    },
  },
  {
    accessorKey: "ts.createdAt",
    header: "Дата додавання",
    cell: (info) => {
      const date = info.getValue() as Date;
      return new Date(date).toLocaleDateString("uk-UA");
    },
  },
];
