import { ColumnDef } from "@tanstack/react-table";

export type Order = {
  nameclient: string;
  pay: string;
  amount: number;
  order_date: Date;
  status: number;
};


export const columns: ColumnDef<Order>[] = [
  { accessorKey: "nameclient", header: "Tên khách hàng" },
  { accessorKey: "pay", header: "Thanh toán" },
  {
    accessorKey: "amount",
    header: "Tổng tiền",
    cell: ({ getValue }) => `${(getValue() as number).toLocaleString()} đ`,
  },
  {
    accessorKey: "order_date",
    header: "Ngày đặt",
    cell: ({ getValue }) => (getValue() as Date).toLocaleDateString(),
  },
  
];
