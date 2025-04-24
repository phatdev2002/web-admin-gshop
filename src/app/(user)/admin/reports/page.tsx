"use client";
import React, { useEffect, useState } from "react";
import BarChart2 from "@/components/ui/BarChart/BarChart2";
import Card, { CardContent, CardProps } from "@/components/ui/Card";
import { CalendarIcon, HandCoinsIcon, Landmark, ShoppingCart } from "lucide-react";
import PieChartComponent from "@/components/ui/PieChart";
import LineChart from "@/components/ui/LineChart";
import "react-datepicker/dist/react-datepicker.css";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { vi } from "date-fns/locale";


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
        const response = await fetch(
          "https://gshopbackend-1.onrender.com/order/list"
        );
        const result = await response.json();

        if (result.status) {
          const orders = result.data;

          type Order = {
            status: string;
            date: string;
            total_price: number;
          };

          const completedOrders = orders.filter(
            (order: Order) => order.status === "Đã giao"
          );

          // Gom nhóm theo tháng và tính tổng total_price
          const monthRevenue: { [key: string]: number } = {};
          completedOrders.forEach((order: Order) => {
            const [, month] = order.date.split("/");
            const key = `Tháng ${Number(month)}`;
            monthRevenue[key] = (monthRevenue[key] || 0) + order.total_price;
          });

          // Sắp xếp theo tháng
          const sortedData = Object.entries(monthRevenue)
            .sort((a, b) => {
              const getMonthNumber = (text: string) =>
                parseInt(text.replace("Tháng ", ""));
              return getMonthNumber(a[0]) - getMonthNumber(b[0]);
            })
            .map(([name, totalRevenue]) => ({ name, totalRevenue }));

          // Set dữ liệu cho cả 2 state
          
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
        const response = await fetch(
          "https://gshopbackend-1.onrender.com/order/revenue"
        );
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
        const response = await fetch(
          "https://gshopbackend-1.onrender.com/order/top-products"
        );
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

  //biểu đồ tùy chỉnh 
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [rangeRevenueData, setRangeRevenueData] = useState<
    { name: string; total: number }[]
  >([]);

  const fetchRangeRevenue = async () => {
    if (!startDate || !endDate) return;
  
    const toDateString = (date: Date) =>
      format(date, "dd/MM/yyyy");
  
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
        const data = Object.entries(result.data.dailyRevenue).map(
          ([date, value]) => ({
            name: date,
            total: Number(value),
            
          })
          
        );
        setRangeRevenueData(data);
        

      }
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu theo khoảng:", err);
    }
  };
  
  const totalRangeRevenue = rangeRevenueData.reduce((sum, item) => sum + item.total, 0);
  //

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
      <section className="grid w-full pb-5 grid-cols-1 gap-4 gap-x-8 transition-all">
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="flex flex-col gap-2">
              <p className="font-semibold">Doanh thu theo khoảng ngày</p>
              <p className="text-xs text-gray-500 pb-4">Thống kê doanh thu từ ngày bắt đầu đến ngày kết thúc</p>
            </div>
            <div className="flex gap-4">
              {/* fsdfsd */}
              <section className="flex gap-4 items-center pb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] bg-blue-100 hover:bg-blue-200 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Chọn ngày bắt đầu"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus locale={vi}/>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] bg-blue-100 hover:bg-blue-200 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : "Chọn ngày kết thúc"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus locale={vi}/>
                  </PopoverContent>
                </Popover>

                <Button className="bg-blue-500 rounded-lg hover:bg-blue-600" onClick={fetchRangeRevenue}>Xem biểu đồ</Button>
              </section>
              </div>
            </div>
            

          
          {Object.keys(rangeRevenueData).length > 0 ? (
            <>
              <LineChart
                data={rangeRevenueData}
                
              />
              <p className="pt-4 text-right font-semibold">
                Tổng doanh thu: {totalRangeRevenue.toLocaleString()} đ
              </p>
            </>
          ) : (
            <p className="text-center p-4">
              {!startDate || !endDate
                ? "Chưa chọn ngày"
                : startDate > endDate
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
            <section>
              <p className="font-semibold pb-2">
                Thể loại Gundam bán chạy nhất 
              </p>
              <p className="pb-4 text-xs text-gray-500">
                Phần trăm bán chạy của thể loại Gundam
              </p>
            </section>
            <PieChartComponent piedata={pieChartDataFromApi} />
          </CardContent>
        </section>
      </section>
    </div>
  );
};

export default ReportPage;
