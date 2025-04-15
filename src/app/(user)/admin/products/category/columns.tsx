// src/app/admin/products/category/columns.ts
import { ColumnDef } from "@tanstack/react-table";
import React from "react";


export type Category = {
  id: string;
  name_type: string;
  product_count: number;
  handleEdit?: (category: Category) => void;
};

export const columns: ColumnDef<Category>[] = [
  { accessorKey: "name_type", header: "Thể loại" },
  { accessorKey: "product_count", header: "Số lượng sản phẩm" },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      // Sẽ nhận được function editCategory từ props (hoặc thông qua context/hook) sau này
      return (
        <button
          className="text-blue-600"
          onClick={() => row.original.handleEdit?.(row.original)}
        >
          Ch
        </button>
      );
    },
  },
];
