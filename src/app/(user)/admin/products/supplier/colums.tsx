
import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "./page";

export const columns: ColumnDef<Supplier>[] = [
  { accessorKey: "supplier", header: "Nhà cung cấp" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "sdt", header: "Số điện thoại" },
  { accessorKey: "investor_name", header: "Tên người đại diện" },
  { accessorKey: "cooperation_day", header: "Ngày hợp tác" },
  { accessorKey: "address", header: "Địa chỉ" },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      // Sẽ nhận được function editCategory từ props (hoặc thông qua context/hook) sau này
      return (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => row.original.onEdit?.(row.original)}
        >
          Chỉnh sửa
        </button>
      );
    },
  },
];
