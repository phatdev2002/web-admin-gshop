"use client";
import { useEffect, useState } from "react";
import BarChart from "@/components/ui/BarChart/BarChart1";
import Card, { CardContent, CardProps } from "@/components/ui/Card";
import TenGundamCard, { TenGundamProps } from "@/components/ui/TenGundamCard";
import { BookCheck, BoxesIcon, ChevronDown, UserCircle, UserSquare2 } from "lucide-react";
import React from "react";
import LineChart from "@/components/ui/LineChart";
import { BASE_URL } from "@/constants";

const OverviewPage = () => {
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalStaff, setTotalStaff] = useState<number>(0);

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

    fetchData(`${BASE_URL}/user/list_user`, setTotalCustomers);
    fetchData(`${BASE_URL}/product/list`, setTotalProducts);
    fetchData(`${BASE_URL}/user/list_staff`, setTotalStaff);
    fetchData(`${BASE_URL}/order/list`, setTotalOrders);
  }, []);

  const [ordersByMonth, setOrdersByMonth] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchOrdersByMonth = async () => {
      try {
        const response = await fetch(`${BASE_URL}/order/list`);
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
        const response = await fetch(`${BASE_URL}/order/top-products`);
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

  const [customRevenueData, setCustomRevenueData] = useState<Record<string, number>>({});
  const [timePeriod, setTimePeriod] = useState("7");

  const handleTimePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimePeriod(event.target.value);
  };

  const fetchRevenueByPeriod = async (timePeriod: string) => {
    const today = new Date();
    const startDate = new Date();
    const formatDate = (d: Date) => {
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`; // <-- có thể cần đổi thành định dạng này
    };
  
    switch (timePeriod) {
      case "7":
        startDate.setDate(today.getDate() - 6);
        break;
      case "30":
        startDate.setDate(today.getDate() - 29);
        break;
      case "60":
        startDate.setDate(today.getDate() - 59);
        break;
      case "365":
        startDate.setFullYear(today.getFullYear() - 2);
        break;
    }
  
    const startFormatted = formatDate(startDate);
    const endFormatted = formatDate(today);
  
    try {
      const response = await fetch(`${BASE_URL}/order/revenue-daily`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: startFormatted, end: endFormatted }),
      });
  
      const result = await response.json();
      console.log("Kết quả doanh thu:", result); // debug
      if (result.status && result.data?.dailyRevenue) {
        setCustomRevenueData(result.data.dailyRevenue);
      } else {
        setCustomRevenueData({});
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu doanh thu tùy chỉnh:", error);
      setCustomRevenueData({});
    }
  };
  

  useEffect(() => {
    fetchRevenueByPeriod(timePeriod);
  }, [timePeriod]);
  const totalRevenue = Object.values(customRevenueData).reduce((sum, current) => sum + current, 0);


  return (
    <div>
      <section className="grid w-full pb-5 grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((d, i) => (
          <Card key={i} amount={d.amount} discription={d.discription} icon={d.icon} label={d.label} />
        ))}
      </section>
      <section className="grid grid-cols-1 transition-all pb-5">
        <CardContent className="gap-4">
            <div className="flex justify-between ">
              <div className="flex flex-col">
                <p className="font-semibold mb-2">Thống kê doanh thu</p>
                <p className=" text-xs text-gray-500">
                Doanh thu từ {timePeriod === "7" ? "7 ngày gần nhất" : timePeriod === "30" ? "30 ngày gần nhất" : timePeriod === "60" ? "60 ngày gần nhất" : "1 năm"}
                </p>
              </div>
              <div className="relative flex items-center text-sm">
                <select
                  className="appearance-none p-2 pr-8 border rounded-lg bg-red-50"
                  value={timePeriod}
                  onChange={handleTimePeriodChange}
                >
                  <option value="7">7 ngày gần nhất</option>
                  <option value="30">30 ngày gần nhất</option>
                  <option value="60">60 ngày gần nhất</option>
                  <option value="365">365 ngày gần nhất</option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-600">
                  <ChevronDown size={20} />
                </div>
                
              </div>

            </div>
            
            

            {Object.keys(customRevenueData).length > 0 ? (
              <LineChart
                data={Object.entries(customRevenueData).map(([date, value]) => ({
                  name: date,
                  total: Number(value),
                }))}
              />
            ) : (
              <p className="text-center p-4">Không có dữ liệu</p>
            )}
            <div className=" w-full flex justify-end">
              <p className="font-semibold text-gray-600">
                Tổng doanh thu: {totalRevenue.toLocaleString("vi-VN")} đ
              </p>
            </div>
            

          </CardContent>
        </section>
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-[7fr_3fr]">
        <section className="grid grid-cols-1 gap-4 transition-all">
          {/* Đơn hàng đã giao */}
          <CardContent className="h-[480px]">
            <p className="font-semibold">Thống kê đơn đặt hàng</p>
            <p className="pb-4 text-xs text-gray-500">Đơn hàng đã giao theo tháng</p>
            {orderBarChartData.length > 0 ? (
              <BarChart data={orderBarChartData} />
            ) : (
              <p className="text-center p-4">Không có dữ liệu</p>
            )}
          </CardContent>
        </section>

        {/* Top 10 Gundam */}
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
