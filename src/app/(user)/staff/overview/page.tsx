"use client";
import React, { useEffect, useState } from "react";
import Card, { CardContent, CardProps } from "@/components/ui/Card";
import { CheckCircleIcon, Settings, ShoppingCart } from "lucide-react";
import LineChart from "@/components/ui/LineChart";

const OverviewPage = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://gshopbackend-1.onrender.com/order/list");
        const result = await response.json();

        if (result.status) {
          const orders = result.data;

          type Order = {
            status: string;
            date: string; // "dd/MM/yyyy"
            total_price: number;
            shipping_fee: number;
          };

          const completedOrdersList = orders.filter(
            (order: Order) => order.status === "Đã giao"
          );
          const pending = orders.filter((order: Order) => order.status === "Đang xử lý").length;

          setTotalOrders(orders.length);
          setCompletedOrders(completedOrdersList.length);
          setPendingOrders(pending);

          // Tính doanh thu theo tháng
          const monthlyRevenue: { [key: string]: number } = {};

          completedOrdersList.forEach((order: Order) => {
            const parts = order.date.split("/"); // ["dd", "MM", "yyyy"]
            const monthYear = `${parts[1]}/${parts[2]}`; // "MM/yyyy"
            const total = order.total_price + order.shipping_fee;

            if (!monthlyRevenue[monthYear]) {
              monthlyRevenue[monthYear] = total;
            } else {
              monthlyRevenue[monthYear] += total;
            }
          });

          // Chuyển thành mảng, sắp xếp theo tháng tăng dần
          const sortedChartData = Object.entries(monthlyRevenue)
            .sort(([a], [b]) => {
              const [monthA, yearA] = a.split("/").map(Number);
              const [monthB, yearB] = b.split("/").map(Number);
              return yearA === yearB ? monthA - monthB : yearA - yearB;
            })
            .map(([name, total]) => ({ name, total }));

          setChartData(sortedChartData);
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

      {/* Biểu đồ doanh thu theo tháng */}
      <section className="grid grid-cols-1 gap-4 transition-all">
        <CardContent>
          <p className="p-4 font-semibold">Doanh thu từ đơn hàng đã giao theo tháng</p>
          <LineChart data={chartData} />
        </CardContent>
      </section>
    </div>
  );
};

export default OverviewPage;
