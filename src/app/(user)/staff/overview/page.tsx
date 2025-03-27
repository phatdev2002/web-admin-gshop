"use client";
import React, { useEffect, useState } from "react";
import Card, { CardContent, CardProps } from "@/components/ui/Card";
import { CheckCircleIcon, Settings, ShoppingCart } from "lucide-react";
import LineChart from "@/components/ui/LineChart";

const OverviewPage = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://gshopbackend.onrender.com/order/list");
        const result = await response.json();
        if (result.status) {
          const total = result.data.length;
          type Order = { status: string }; // Define the type for orders
          const completed = result.data.filter((order: Order) => order.status === "Đã giao").length;
          const pending = result.data.filter((order: Order) => order.status === "Đang xử lý").length;

          setTotalOrders(total);
          setCompletedOrders(completed);
          setPendingOrders(pending);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  const cardData: CardProps[] = [
    {
      label: "Tổng đơn hàng",
      amount: totalOrders.toString(),
      discription: "Tổng số đơn hàng đã đặt",
      icon: ShoppingCart,
    },
    {
      label: "Đơn hàng chờ xử lý",
      amount: pendingOrders.toString(),
      discription: "Số lượng đơn hàng chưa hoàn thành",
      icon: Settings,
    },
    {
      label: "Đơn hàng đã hoàn thành",
      amount: completedOrders.toString(),
      discription: "Số lượng đơn đã giao thành công",
      icon: CheckCircleIcon,
    },
  ];

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
          <p className="p-4">Chưa có api</p>
          <LineChart data={[{ name: "January", total: 100 }, { name: "February", total: 200 }]} />
        </CardContent>
      </section>

    </div>
  );
};

export default OverviewPage;
