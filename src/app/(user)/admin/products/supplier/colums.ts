// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "./page"; // Nếu có file types.ts, hoặc dùng trực tiếp trong page.tsx

export const columns: ColumnDef<Supplier>[] = [
  { accessorKey: "supplier", header: "Nhà cung cấp" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "sdt", header: "Số điện thoại" },
  { accessorKey: "investor_name", header: "Tên người đại diện" },
  { accessorKey: "cooperation_day", header: "Ngày hợp tác" },
  { accessorKey: "address", header: "Địa chỉ" },
];
