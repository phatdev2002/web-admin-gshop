"use client";
import { useEffect, useState } from "react";
import BarChart from "@/components/ui/BarChart/BarChart1";
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
  const [revenueData, setRevenueData] = useState({
    dailyRevenueLast7Days: {},
  });

  // Fetch dữ liệu tổng quan
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

    fetchData("https://gshopbackend-1.onrender.com/user/list_user", setTotalCustomers);
    fetchData("https://gshopbackend-1.onrender.com/product/list", setTotalProducts);
    fetchData("https://gshopbackend-1.onrender.com/user/list_staff", setTotalStaff);
    fetchData("https://gshopbackend-1.onrender.com/order/list", setTotalOrders);
  }, []);

  const [ordersByMonth, setOrdersByMonth] = useState<Record<string, number>>({});

  // Thống kê đơn hàng theo tháng
  useEffect(() => {
    const fetchOrdersByMonth = async () => {
      try {
        const response = await fetch("https://gshopbackend-1.onrender.com/order/list");
        const result = await response.json();

        if (result.status && Array.isArray(result.data)) {
          type Order = { status: string; date: string };
          const deliveredOrders = result.data.filter((order: Order) => order.status === "Đã giao");

          const monthlyCounts: Record<string, number> = {};
          deliveredOrders.forEach((order: Order) => {
            const [, month] = order.date.split("/");
            const monthKey = `Tháng ${month}`;
            monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
          });

          setOrdersByMonth(monthlyCounts);
        } else {
          setOrdersByMonth({});
        }
      } catch (error) {
        console.error("Lỗi khi thống kê đơn hàng theo tháng:", error);
        setOrdersByMonth({});
      }
    };

    fetchOrdersByMonth();
  }, []);

  const orderBarChartData = Object.entries(ordersByMonth).map(([month, count]) => ({
    name: month,
    total: count,
  }));

  // Fetch doanh thu
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch("https://gshopbackend-1.onrender.com/order/revenue");
        const result = await response.json();
        if (result.status) {
          setRevenueData({
            dailyRevenueLast7Days: result.data.dailyRevenueLast7Days,
          });
          setMonthlyRevenue(result.data.monthlyRevenue || {});
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
      }
    };

    fetchRevenueData();
  }, []);

  // Dữ liệu biểu đồ doanh thu theo tháng
  const monthlyRevenueChartData = Object.entries(monthlyRevenue ?? {}).map(([month, value]) => ({
    name: month,
    total: value || 0,
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

  const [topProducts, setTopProducts] = useState<TenGundamProps[]>([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch("https://gshopbackend-1.onrender.com/order/top-products");
        const result = await response.json();

        if (result.status && Array.isArray(result.byQuantity)) {
          type ProductItem = { name: string; totalSold: number };
          const top10 = result.byQuantity.slice(0, 10).map((item: ProductItem) => ({
            name: item.name,
            amount: `${item.totalSold} bộ`,
          }));
          setTopProducts(top10);
        } else {
          setTopProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy top sản phẩm:", error);
        setTopProducts([]);
      }
    };

    fetchTopProducts();
  }, []);

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
            <p className="font-semibold">Thống kê doanh thu</p>
            <p className="pb-4 text-xs text-gray-500">Doanh thu trong năm nay</p>
            {monthlyRevenueChartData.length > 0 ? (
              <LineChart data={monthlyRevenueChartData} />
            ) : (
              <p className="text-center p-4">Không có dữ liệu</p>
            )}
          </CardContent>

          <CardContent>
            <p className="font-semibold">Thống kê doanh thu</p>
            <p className="pb-4 text-xs text-gray-500">Doanh thu trong 7 ngày gần nhất</p>
            <LineChart
              data={Object.entries(revenueData.dailyRevenueLast7Days)
                .reverse()
                .map(([date, value]) => ({
                  name: date,
                  total: Number(value),
                }))}
            />
          </CardContent>

          <CardContent>
            <p className="font-semibold">Thống kê đơn đặt hàng</p>
            <p className="pb-4 text-xs text-gray-500">Đơn hàng đã giao theo tháng</p>
            {orderBarChartData.length > 0 ? (
              <BarChart data={orderBarChartData} />
            ) : (
              <p className="text-center p-4">Không có dữ liệu</p>
            )}
          </CardContent>
        </section>

        <section>
          <CardContent>
            <section>
              <p className="font-semibold">Top 10 Gundam</p>
              <p className="pb-4 text-xs text-gray-500">Xếp hạng 10 bộ Gundam bán chạy nhất</p>
            </section>
            {topProducts.length > 0 ? (
              topProducts.map((d, i) => <TenGundamCard key={i} name={d.name} amount={d.amount} />)
            ) : (
              <p className="text-center text-sm text-gray-500">Không có dữ liệu</p>
            )}
          </CardContent>
        </section>
      </section>
    </div>
  );
};

export default OverviewPage;
