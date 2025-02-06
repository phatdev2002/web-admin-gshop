// src/app/admin/products/category/columns.ts

import { ColumnDef } from "@tanstack/react-table";

// Define Category type
type Category = {
  name_type: string;
  investor_name: string;
  sdt: string;
  email: string;
  sales: string;
};

export const columns: ColumnDef<Category>[] = [
  { accessorKey: "name_type", header: "Thể loại" },
  { accessorKey: "investor_name", header: "Tên nhà đầu tư" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "sdt", header: "Số điện thoại" },
  { accessorKey: "sales", header: "Doanh số" },
];
