"use client";
import React, { useEffect, useState } from "react";
import BarChart2 from "@/components/ui/BarChart/BarChart2";
import Card, { CardContent, CardProps } from "@/components/ui/Card";
import { HandCoinsIcon, Landmark, ShoppingCart } from "lucide-react";
import PieChartComponent from "@/components/ui/PieChart";
import LineChart from "@/components/ui/LineChart";
import { Button } from "@/components/ui/button";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import "dayjs/locale/vi";

const ReportPage = () => {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    toDayRevenue: 0,
    toDayOrders: 0,
    dailyRevenueLast7Days: {},
  });

  const [monthlyRevenueData, setMonthlyRevenueData] = useState<
    { name: string; totalRevenue: number }[]
  >([]);

  const [categoryRatioData, setCategoryRatioData] = useState<
    { name: string; percentage: string }[]
  >([]);

  useEffect(() => {
    const fetchMonthlyRevenueData = async () => {
      try {
        const response = await fetch("https://gshopbackend-1.onrender.com/order/list");
        const result = await response.json();

        if (result.status) {
          const orders = result.data;
          type Order = { status: string; date: string; total_price: number };
          const completedOrders = orders.filter((order: Order) => order.status === "Đã giao");

          const monthRevenue: { [key: string]: number } = {};
          completedOrders.forEach((order: Order) => {
            const [, month] = order.date.split("/");
            const key = `Tháng ${Number(month)}`;
            monthRevenue[key] = (monthRevenue[key] || 0) + order.total_price;
          });

          const sortedData = Object.entries(monthRevenue)
            .sort((a, b) => parseInt(a[0].replace("Tháng ", "")) - parseInt(b[0].replace("Tháng ", "")))
            .map(([name, totalRevenue]) => ({ name, totalRevenue }));

          setMonthlyRevenueData(sortedData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu theo tháng:", error);
      }
    };

    fetchMonthlyRevenueData();
  }, []);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch("https://gshopbackend-1.onrender.com/order/revenue");
        const result = await response.json();
        if (result.status) {
          setRevenueData({
            totalRevenue: result.data.totalRevenue,
            toDayRevenue: result.data.toDayRevenue,
            toDayOrders: result.data.totalCompletedOrders,
            dailyRevenueLast7Days: result.data.dailyRevenueLast7Days,
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
      }
    };

    fetchRevenueData();
  }, []);

  useEffect(() => {
    const fetchTopProductsData = async () => {
      try {
        const response = await fetch("https://gshopbackend-1.onrender.com/order/top-products");
        const result = await response.json();
        if (result.status) {
          setCategoryRatioData(result.categoryRatio);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tỉ lệ loại Gundam:", error);
      }
    };

    fetchTopProductsData();
  }, []);

  const pieChartDataFromApi = categoryRatioData.map((item, index) => ({
    id: index,
    value: parseFloat(item.percentage),
    name: `${item.name} (${item.percentage})`,
  }));

  const cardData: CardProps[] = [
    {
      label: "Tổng toàn bộ doanh thu",
      amount: `${revenueData.totalRevenue.toLocaleString()} đ`,
      discription: "Doanh thu sản phẩm đã bán",
      icon: Landmark,
    },
    {
      label: "Tổng doanh thu hôm nay",
      amount: `${revenueData.toDayRevenue.toLocaleString()} đ`,
      discription: "Số tiền kiếm được trong hôm nay",
      icon: HandCoinsIcon,
    },
    {
      label: "Tổng đơn hàng đã giao",
      amount: revenueData.toDayOrders.toString(),
      discription: "Tất cả đơn hàng đã giao thành công",
      icon: ShoppingCart,
    },
  ];

  // Chọn ngày
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [rangeRevenueData, setRangeRevenueData] = useState<{ name: string; total: number }[]>([]);

  const fetchRangeRevenue = async () => {
    if (!startDate || !endDate) return;

    const toDateString = (date: Dayjs) => date.format("DD/MM/YYYY");

    const body = {
      start: toDateString(startDate),
      end: toDateString(endDate),
    };

    try {
      const res = await fetch("https://gshopbackend-1.onrender.com/order/revenue-daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result.status) {
        const data = Object.entries(result.data.dailyRevenue).map(([date, value]) => ({
          name: date,
          total: Number(value),
        }));
        setRangeRevenueData(data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu theo khoảng:", err);
    }
  };

  const totalRangeRevenue = rangeRevenueData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div>
      <section className="grid w-full pb-4 grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-3">
        {cardData.map((d, i) => (
          <Card key={i} amount={d.amount} discription={d.discription} icon={d.icon} label={d.label} />
        ))}
      </section>

      <section className="grid w-full pb-5 grid-cols-1 gap-4 gap-x-8 transition-all">
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="flex flex-col gap-2">
              <p className="font-semibold">Doanh thu theo khoảng ngày</p>
              <p className="text-xs text-gray-500 pb-4">
                Thống kê doanh thu từ ngày bắt đầu đến ngày kết thúc
              </p>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
              <div className="flex gap-4 items-center pb-4">
                <DatePicker
                  label="Ngày bắt đầu"
                  value={startDate}
                  onChange={(value) => setStartDate(value)}
                />
                <DatePicker
                  label="Ngày kết thúc"
                  value={endDate}
                  onChange={(value) => setEndDate(value)}
                />
                <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={fetchRangeRevenue}>
                  Xem biểu đồ
                </Button>
              </div>
            </LocalizationProvider>
          </div>

          {rangeRevenueData.length > 0 ? (
            <>
              <LineChart data={rangeRevenueData} />
              <p className="pt-4 text-right font-semibold">
                Tổng doanh thu: {totalRangeRevenue.toLocaleString()} đ
              </p>
            </>
          ) : (
            <p className="text-center p-4">
              {!startDate || !endDate
                ? "Chưa chọn ngày"
                : startDate.isAfter(endDate)
                ? "Vui lòng chọn ngày kết thúc sau ngày bắt đầu"
                : "Chưa có dữ liệu"}
            </p>
          )}
        </CardContent>
      </section>

      <section className="gap-4 transition-all lg:grid-cols-[7fr_3fr] grid-cols-1 lg:grid">
        <section className="grid grid-cols-1 gap-4 transition-all">
          <CardContent className="h-[500px]">
            <p className="font-semibold">Thống kê doanh thu theo tháng</p>
            <p className="pb-4 text-xs text-gray-500">
              Biểu đồ cột tổng tiền của các đơn hàng đã giao chưa trừ chi phí gốc
            </p>
            {monthlyRevenueData.length > 0 ? (
              <BarChart2 data={monthlyRevenueData} />
            ) : (
              <p className="text-center p-4">Không có dữ liệu</p>
            )}
          </CardContent>
        </section>

        <section>
          <CardContent>
            <p className="font-semibold pb-2">Thể loại Gundam bán chạy nhất</p>
            <p className="pb-4 text-xs text-gray-500">Phần trăm bán chạy của thể loại Gundam</p>
            <PieChartComponent piedata={pieChartDataFromApi} />
          </CardContent>
        </section>
      </section>
    </div>
  );
};

export default ReportPage;
