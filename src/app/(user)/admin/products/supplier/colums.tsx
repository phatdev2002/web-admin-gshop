
import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "./page";
import { Edit } from "lucide-react";

export const columns: ColumnDef<Supplier>[] = [
  { accessorKey: "name", header: "Nhà cung cấp" },
  { accessorKey: "email", header: "Email" },
  {
    header: "Số điện thoại",
    accessorKey: "sdt",
    cell: ({ row }) => {
      const phone = row.original.sdt.replace(/\D/g, "");
      const formatted = phone.replace(/^(\d{4})(\d{3})(\d{3})$/, "$1 $2 $3");
      return <span>{formatted}</span>;
    },
  },  
  { accessorKey: "investor_name", header: "Tên người đại diện" },
  { accessorKey: "cooperation_day", header: "Ngày hợp tác" },
  { accessorKey: "address", header: "Địa chỉ" },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      // Sẽ nhận được function editCategory từ props (hoặc thông qua context/hook) sau này
      return (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => row.original.onEdit?.(row.original)}
        >
          <Edit size={20}/>
        </button>
      );
    },
  },
];
