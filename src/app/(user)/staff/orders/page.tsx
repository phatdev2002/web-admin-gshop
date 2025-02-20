"use client";
import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { hardcodedOrders, timeFilters } from "@/data/order";



const OrderPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState("week");
  const [selectedDate, setSelectedDate] = useState("");

  // Lọc dữ liệu theo thời gian
  const filteredData = useMemo(() => {
    const now = new Date();
    const todayString = now.toDateString();
  
    // Tính ngày đầu tuần (thứ Hai) và ngày cuối tuần (Chủ Nhật)
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay(); // 0 = Chủ Nhật, 1 = Thứ Hai, ..., 6 = Thứ Bảy
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(now.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0); // Đưa về đầu ngày
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // Đưa về cuối ngày Chủ Nhật
  
    return hardcodedOrders.filter((order) => {
      const matchesSearch = order.nameclient.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === null || order.status === statusFilter;
  
      // Xử lý bộ lọc thời gian
      const orderDate = new Date(order.order_date);
      let matchesDate = true;
  
      if (selectedDate) {
        matchesDate = orderDate.toISOString().split("T")[0] === selectedDate;
      } else {
        switch (dateFilter) {
          case "today":
            matchesDate = orderDate.toDateString() === todayString;
            break;
          case "week":
            matchesDate = orderDate >= startOfWeek && orderDate <= endOfWeek;
            break;
          case "month":
            matchesDate = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            break;
          case "year":
            matchesDate = orderDate.getFullYear() === now.getFullYear();
            break;
        }
      }
  
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, statusFilter, dateFilter, selectedDate]);
  
  

  return (
    <div>
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
          <Button variant="outline" onClick={() => setSearch("")}>
            Làm mới danh sách
          </Button>
        </div>
      </div>

      

      {/* Bộ lọc trạng thái */}
      <div className="flex items-center gap-2 mb-4">
      {[
        { label: "Tất cả", value: null, color: "bg-gray-500 text-white", hover: "hover:bg-gray-500 hover:text-white" },
        { label: "Đang xử lý", value: 3, color: "bg-red-500 text-white", hover: "hover:bg-red-500 hover:text-white" },
        { label: "Đang giao", value: 2, color: "bg-orange-500 text-white", hover: "hover:bg-orange-500 hover:text-white" },
        { label: "Hoàn thành", value: 1, color: "bg-green-500 text-white", hover: "hover:bg-green-500 hover:text-white" },
      ].map((filter) => (
        <Button
          key={filter.label}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            statusFilter === filter.value
              ? `${filter.color} ${filter.hover}` // Nếu được chọn, giữ màu gốc và hover tối hơn
              : `bg-white text-gray-700 ${filter.hover}` // Nếu chưa chọn, hover đổi màu chữ
          }`}
          onClick={() => setStatusFilter(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
        <div className="ml-auto flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-2 py-1 rounded-lg gap-2"
          />
          {/* Bộ lọc theo thời gian */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto flex items-center gap-2">
                {timeFilters.find((f) => f.value === dateFilter)?.label || "Chọn thời gian"}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {timeFilters.map((filter) => (
                <DropdownMenuItem key={filter.value} onClick={() => setDateFilter(filter.value)}>
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default OrderPage;

// Định nghĩa dữ liệu và cột
export type Order = {
  nameclient: string;
  pay: string;
  amount: number;
  order_date: Date;
  status: number;
};

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
    cell: ({ getValue }) => `${(getValue() as number).toLocaleString()} đ`,
  },
  {
    accessorKey: "order_date",
    header: "Ngày đặt",
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ getValue }) => {
      const status = getValue() as number;
      const statusText = mapStatus(status);
      let statusClass = "";

      switch (status) {
        case 1:
          statusClass = "bg-green-200 text-green-500";
          break;
        case 2:
          statusClass = "bg-orange-200 text-orange-800";
          break;
        case 3:
          statusClass = "bg-red-200 text-red-800";
          break;
        default:
          statusClass = "bg-gray-100";
      }

      return (
        <span className={`inline-block px-2 py-1 rounded ${statusClass}`}>
          {statusText}
        </span>
      );
    },
  },
];
