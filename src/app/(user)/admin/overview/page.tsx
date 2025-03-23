"use client";
import { useEffect, useState } from "react";
import BarChart from "@/components/ui/BarChart";
import Card, { CardContent, CardProps } from "@/components/ui/Card";
import TenGundamCard, { TenGundamProps } from "@/components/ui/TenGundamCard";
import { BookCheck, BoxesIcon, UserCircle, UserSquare2 } from "lucide-react";
import React from "react";
import LineChart from "@/components/ui/LineChart";

const OverviewPage = () => {
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalStaff, setTotalStaff] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<Record<string, number>>({});

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async (url: string, setter: (value: number) => void) => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.status && Array.isArray(result.data)) {
          setter(result.data.length);
        } else {
          setter(0);
        }
      } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu từ ${url}:`, error);
        setter(0);
      }
    };

    fetchData("https://gshopbackend.onrender.com/user/list_user", setTotalCustomers);
    fetchData("https://gshopbackend.onrender.com/product/list", setTotalProducts);
    fetchData("https://gshopbackend.onrender.com/user/list_staff", setTotalStaff);
    fetchData("https://gshopbackend.onrender.com/order/list", setTotalOrders);
  }, []);

  // Fetch doanh thu theo tháng
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch("https://gshopbackend.onrender.com/order/revenue");
        const result = await response.json();

        if (result.status && result.data?.monthlyRevenue) {
          setMonthlyRevenue(result.data.monthlyRevenue);
        } else {
          setMonthlyRevenue({});
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
        setMonthlyRevenue({});
      }
    };

    fetchRevenue();
  }, []);

  // Chuyển đổi dữ liệu doanh thu để hiển thị biểu đồ
  const revenueData = Object.entries(monthlyRevenue ?? {}).map(([month, value]) => ({
    name: month,
    total: value || 0, // Tránh lỗi undefined
  }));

  const cardData: CardProps[] = [
    {
      label: "Tổng khách hàng",
      amount: totalCustomers.toString(),
      discription: "Số khách đã đăng ký tài khoản",
      icon: UserCircle,
    },
    {
      label: "Tổng sản phẩm",
      amount: totalProducts.toString(),
      discription: "Số lượng hàng còn lại",
      icon: BoxesIcon,
    },
    {
      label: "Tổng đơn hàng",
      amount: totalOrders.toString(),
      discription: "Các đơn hàng đã đặt",
      icon: BookCheck,
    },
    {
      label: "Tổng nhân viên",
      amount: totalStaff.toString(),
      discription: "Số lượng nhân viên đang làm việc",
      icon: UserSquare2,
    },
  ];

  const gundamData: TenGundamProps[] = [
    { name: "Rx 78-2", amount: "8.500 bộ" },
    { name: "Wing Gundam Zero", amount: "7.800 bộ" },
    { name: "Strike Freedom Gundam", amount: "6.900 bộ" },
    { name: "Unicorn Gundam", amount: "6.500 bộ" },
    { name: "Gundam Exia", amount: "6.200 bộ" },
    { name: "Zeta Gundam", amount: "5.800 bộ" },
    { name: "Nu Gundam", amount: "5.400 bộ" },
    { name: "Strike Gundam", amount: "5.100 bộ" },
    { name: "Barbatos Gundam", amount: "4.800 bộ" },
    { name: "Sazabi", amount: "4.300 bộ" },
  ];

  return (
    <div>
      <section className="grid w-full pb-5 grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((d, i) => (
          <Card key={i} amount={d.amount} discription={d.discription} icon={d.icon} label={d.label} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-[7fr_3fr]">
        <section className="grid grid-cols-1 gap-4 transition-all">
          <CardContent>
            <p className="p-4 font-semibold">Thống kê doanh thu</p>
            {revenueData.length > 0 ? <LineChart data={revenueData} /> : <p className="text-center p-4">Không có dữ liệu</p>}
          </CardContent>

          <CardContent>
            <p className="p-4 font-semibold">Thống kê đơn đặt hàng</p>
            <BarChart />
          </CardContent>
        </section>

        <section>
          <CardContent>
            <section>
              <p className="font-semibold">Xếp hạng 10 bộ Gundam bán chạy nhất</p>
            </section>
            {gundamData.map((d, i) => (
              <TenGundamCard key={i} name={d.name} amount={d.amount} />
            ))}
          </CardContent>
        </section>
      </section>
    </div>
  );
};

export default OverviewPage;
