"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import Card, { CardContent, CardProps } from '@/components/ui/Card';
import { CheckCircleIcon, Settings, ShoppingCart } from 'lucide-react';
import LineChart from '@/components/ui/LineChart';

const cardData: CardProps[] = [
  {
    label: "Tổng đơn hàng hôm nay",
    amount: "3000",
    discription: "Số đơn hàng chưa xử lý và đã hoàn thành",
    icon: ShoppingCart,
  },
  {
    label: "Tổng đơn hàng chờ xử lý",
    amount: "245",
    discription: "Số lượng đơn hàng đang trong tình trạng chưa xử lý",
    icon: Settings,
  },
  {
    label: "Tổng đơn hàng đã hoàn thành",
    amount: "7",
    discription: "Các đơn hàng đã giao thành công",
    icon: CheckCircleIcon,
  },
];

const hardcodedOrders = [
  {
    nameclient: "Nguyen Duc Phat",
    pay: "Tiền mặt",
    amount: 1500000,
    order_date: new Date("2025-02-17"),
    status: 1,
  },
  {
    nameclient: "Le Minh Tu",
    pay: "Chuyển khoản",
    amount: 2000000,
    order_date: new Date("2025-02-16"),
    status: 2,
  },
  {
    nameclient: "Tran Thi Lan",
    pay: "Tiền mặt",
    amount: 800000,
    order_date: new Date("2025-02-15"),
    status: 3,
  },
  {
    nameclient: "Hoang Thi Lan",
    pay: "Chuyển khoản",
    amount: 3000000,
    order_date: new Date("2025-02-14"),
    status: 2,
  },
  {
    nameclient: "Nguyen Thi Mai",
    pay: "Tiền mặt",
    amount: 1200000,
    order_date: new Date("2025-02-13"),
    status: 1,
  },
  {
    nameclient: "Pham Quang Duy",
    pay: "Chuyển khoản",
    amount: 2500000,
    order_date: new Date("2025-02-12"),
    status: 2,
  },
  {
    nameclient: "Nguyen Minh Tu",
    pay: "Tiền mặt",
    amount: 1700000,
    order_date: new Date("2025-02-11"),
    status: 3,
  },
  {
    nameclient: "Hoang Thanh Son",
    pay: "Chuyển khoản",
    amount: 2300000,
    order_date: new Date("2025-02-10"),
    status: 1,
  },
  {
    nameclient: "Tran Thi Thao",
    pay: "Tiền mặt",
    amount: 900000,
    order_date: new Date("2025-02-09"),
    status: 2,
  },
  {
    nameclient: "Pham Thanh Tu",
    pay: "Chuyển khoản",
    amount: 3500000,
    order_date: new Date("2025-02-08"),
    status: 3,
  },
  {
    nameclient: "Le Quang Minh",
    pay: "Tiền mặt",
    amount: 4000000,
    order_date: new Date("2025-02-07"),
    status: 1,
  },
  {
    nameclient: "Nguyen Thi Kim",
    pay: "Chuyển khoản",
    amount: 1800000,
    order_date: new Date("2025-02-06"),
    status: 2,
  },
  {
    nameclient: "Vu Thi Lan",
    pay: "Tiền mặt",
    amount: 2700000,
    order_date: new Date("2025-02-05"),
    status: 3,
  },
  {
    nameclient: "Tran Minh Tu",
    pay: "Chuyển khoản",
    amount: 3200000,
    order_date: new Date("2025-02-04"),
    status: 1,
  },
  {
    nameclient: "Le Thi Hoa",
    pay: "Tiền mặt",
    amount: 1500000,
    order_date: new Date("2025-02-03"),
    status: 2,
  },
  {
    nameclient: "Nguyen Thi Mai",
    pay: "Chuyển khoản",
    amount: 2100000,
    order_date: new Date("2025-02-02"),
    status: 3,
  },
];


const OverviewPage = () => {
  const [search, setSearch] = useState("");
  
    // Use hardcoded data instead of API query
    const data = hardcodedOrders;
  
    // Filter data by client name
    const filteredData = data.filter(order =>
      order.nameclient.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      <section className="grid w-full pb-4 grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-3">
        {cardData.map((d, i) => (
          <Card
            key={i}
            amount={d.amount}
            discription={d.discription}
            icon={d.icon}
            label={d.label}
          />
        ))}
      </section>
      <section className="grid grid-cols-1 gap-4 transition-all">
          <CardContent>
            <p className="p-4 font-semibold">Thống kê đơn đặt hàng</p>
            <LineChart />
          </CardContent>
      </section>
      <section>
        <h1 className="text-xl font-semibold mt-5 mb-2">Danh sách đơn hàng</h1>
          <div className="flex flex-row align-top mb-5 justify-between">
            
            <p className="text-lg">{filteredData.length || 0} đơn hàng</p>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên khách hàng"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 bg-white w-64"
                />
              </div>
              <Button variant="outline">
                Làm mới danh sách
              </Button>
            </div>
          </div>
          <DataTable columns={columns} data={filteredData} />
      </section>
    </div>
  );
};

export default OverviewPage;

// Loại dữ liệu
export type Order = {
  nameclient: string;
  pay: string;
  amount: number; // changed to number
  order_date: Date; // changed to Date object
  status: number; // status as number
};

// Định nghĩa cột cho bảng
const mapStatus = (status: number) => {
  switch (status) {
    case 1:
      return "Hoàn thành";
    case 2:
      return "Đang giao";
    case 3:
      return "Đang xử lý";
    default:
      return "Không xác định";
  }
};

export const columns: ColumnDef<Order>[] = [
  { accessorKey: "nameclient", header: "Tên khách hàng" },
  { accessorKey: "pay", header: "Thanh toán" },
  {
    accessorKey: "amount",
    header: "Tổng tiền",
    // Render amount as a formatted string
    cell: ({ getValue }) => `${(getValue() as number).toLocaleString()} đ`,
  },
  {
    accessorKey: "order_date",
    header: "Ngày đặt",
    // Render order_date as a formatted string
    cell: ({ getValue }) => (getValue() as Date).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    // Render status as text and apply dynamic background color
    cell: ({ getValue }) => {
      const status = getValue() as number;
      const statusText = mapStatus(status);
      let statusClass = "";

      switch (status) {
        case 1:
          statusClass = "bg-green-200 text-green-500"; // Green for "Hoàn thành"
          break;
        case 2:
          statusClass = "bg-orange-200 text-orange-800"; // Orange for "Đang giao"
          break;
        case 3:
          statusClass = "bg-red-200 text-red-800"; // Red for "Đang xử lý"
          break;
        default:
          statusClass = "bg-gray-100"; // Default for undefined status
      }

      return (
        <span className={`inline-block px-2 py-1 rounded ${statusClass}`}>
          {statusText}
        </span>
      );
    },
  },
];