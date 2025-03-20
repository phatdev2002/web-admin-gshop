"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Card, { CardContent, CardProps } from "@/components/ui/Card";
import { CheckCircleIcon, Settings, ShoppingCart } from "lucide-react";
import LineChart from "@/components/ui/LineChart";
import { columns, Order } from "./columns"; // Import columns từ file riêng

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

const hardcodedOrders: Order[] = [
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
];

const OverviewPage = () => {
  const [search, setSearch] = useState("");

  // Lọc dữ liệu theo tên khách hàng
  const filteredData = hardcodedOrders.filter((order) =>
    order.nameclient.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Thống kê đơn hàng */}
      <section className="grid w-full pb-4 grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-3">
        {cardData.map((d, i) => (
          <Card key={i} amount={d.amount} discription={d.discription} icon={d.icon} label={d.label} />
        ))}
      </section>

      {/* Biểu đồ thống kê */}
      <section className="grid grid-cols-1 gap-4 transition-all">
        <CardContent>
          <p className="p-4 font-semibold">Thống kê đơn đặt hàng</p>
          <LineChart />
        </CardContent>
      </section>

      {/* Danh sách đơn hàng */}
      <section>
        <h1 className="text-xl font-semibold mt-5 mb-2">Danh sách đơn hàng</h1>
        <div className="flex flex-row align-top mb-5 justify-between">
          <p className="text-lg">{filteredData.length} đơn hàng</p>
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
        <DataTable columns={columns} data={filteredData} />
      </section>
    </div>
  );
};

export default OverviewPage;
