"use client";
import React, { useEffect, useState } from "react";
import Card, { CardContent, CardProps } from "@/components/ui/Card";
import { CheckCircleIcon, Settings, XCircle, Truck } from "lucide-react";
import LineChart from "@/components/ui/LineChartStaff";
import { BASE_URL } from "@/constants";

const OverviewPage = () => {
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [canceledOrders, setCanceledOrders] = useState(0);
  const [shippingOrders, setShippingOrders] = useState(0);
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("Đang xử lý");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/order/list`);
        const result = await response.json();

        if (result.status) {
          const orders = result.data;

          type Order = {
            status: string;
            date: string;
            total_price: number;
            shipping_fee: number;
          };

          const completedOrdersList = orders.filter((order: Order) => order.status === "Đã giao");
          const pending = orders.filter((order: Order) => order.status === "Đang xử lý").length;
          const canceled = orders.filter((order: Order) => order.status === "Đã hủy").length;
          const shipping = orders.filter((order: Order) => order.status === "Đang giao hàng").length;

          setCompletedOrders(completedOrdersList.length);
          setPendingOrders(pending);
          setCanceledOrders(canceled);
          setShippingOrders(shipping);

          const monthlyOrderCount: { [key: string]: number } = {};
          orders.forEach((order: Order) => {
            if (order.status === selectedStatus) {
              const parts = order.date.split("/");
              const monthYear = `${parts[1]}/${parts[2]}`;
              monthlyOrderCount[monthYear] = (monthlyOrderCount[monthYear] || 0) + 1;
            }
          });

          const sortedChartData = Object.entries(monthlyOrderCount)
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
  }, [selectedStatus]);

  const cardData: (Omit<CardProps, "discription"> & { status: string })[] = [
    {
      label: "Đơn hàng chờ xử lý",
      amount: pendingOrders.toString(),
      icon: Settings,
      status: "Đang xử lý"
    },
    {
      label: "Đơn hàng đang giao",
      amount: shippingOrders.toString(),
      icon: Truck,
      status: "Đang giao hàng"
    },
    {
      label: "Đơn hàng đã hoàn thành",
      amount: completedOrders.toString(),
      icon: CheckCircleIcon,
      status: "Đã giao"
    },
    {
      label: "Đơn hàng đã hủy",
      amount: canceledOrders.toString(),
      icon: XCircle,
      status: "Đã hủy"
    },
  ];

  return (
    <div>
      {/* Thống kê đơn hàng */}
      <section className="grid w-full pb-4 grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((d, i) => (
          <div
            key={i}
            className={`cursor-pointer rounded-2xl p-1 ${selectedStatus === d.status ? "bg-red-400" : "bg-gray-300"}`}
            onClick={() => setSelectedStatus(d.status)}
          >
            <Card amount={d.amount} icon={d.icon} label={d.label} discription={""} />
          </div>
        ))}
      </section>

      {/* Biểu đồ số đơn hàng theo tháng */}
      <section className="grid grid-cols-1 gap-4 transition-all">
        <CardContent>
          <p className="p-4 font-semibold">Số đơn hàng theo tháng (Trạng thái: {selectedStatus})</p>
          <LineChart data={chartData} />
        </CardContent>
      </section>
    </div>
  );
};

export default OverviewPage;
