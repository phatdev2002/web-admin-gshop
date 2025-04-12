// columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";

interface OrderDetail {
  id_product: string;
  product_name: string;
  quantity: number;
  unit_price: number;
    product_image: string;
}

export const columns: ColumnDef<OrderDetail>[] = [
  {
    accessorKey: "product_name",
    header: "Tên sản phẩm",
    cell: ({ row }) => <span className="font-semibold">{row.original.product_name}</span>,
  },
  {
    accessorKey: "quantity",
    header: "Số lượng",
    cell: ({ row }) => <span>{row.original.quantity}</span>,
  },
  {
    accessorKey: "unit_price",
    header: "Đơn giá (VND)",
    cell: ({ row }) => (
      <span>{row.original.unit_price.toLocaleString("vi-VN")}</span>
    ),
  },
  {
    id: "total_price",
    header: "Thành tiền (VND)",
    cell: ({ row }) => {
      const { quantity, unit_price } = row.original;
      const total = quantity * unit_price;
      return <span>{total.toLocaleString("vi-VN")}</span>;
    },
  },
  {
    id: "product_image",
    header: "Ảnh sản phẩm",
    cell: ({ row }) => {
      const imageUrl = row.original.product_image;
      return imageUrl ? (
        <img src={imageUrl} alt="Ảnh sản phẩm" className="w-16 h-16 object-cover rounded" />
      ) : (
        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded">
          No Image
        </div>
      );
    },
},
];
