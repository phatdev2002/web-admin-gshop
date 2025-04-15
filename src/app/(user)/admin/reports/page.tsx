"use client";
import React, { useEffect, useState } from 'react';
import BarChart2 from '@/components/ui/BarChart/BarChart2';
import Card, { CardContent, CardProps } from '@/components/ui/Card';
import { HandCoinsIcon, Landmark, ShoppingCart } from 'lucide-react';
import LineChart from '@/components/ui/LineChart';
import PieChartComponent from '@/components/ui/PieChart';

const ReportPage = () => {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    toDayRevenue: 0,
    toDayOrders: 0,
    dailyRevenueLast7Days: {},
  });

  type MonthlyRevenue = {
    name: string; // Ví dụ: "Tháng 1"
    totalRevenue: number; // Tổng doanh thu của tháng
  };


  const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyRevenue[]>([]);

useEffect(() => {
  const fetchMonthlyRevenueData = async () => {
    try {
      const response = await fetch('https://gshopbackend-1.onrender.com/order/list');
      const result = await response.json();

      if (result.status) {
        const orders = result.data;

        type Order = {
          status: string;
          date: string;
          total_price: number;
        };

        const completedOrders = orders.filter((order: Order) => order.status === "Đã giao");

        // Gom nhóm theo tháng và tính tổng total_price
        const monthRevenue: { [key: string]: number } = {};
        completedOrders.forEach((order: Order) => {
          const [, month,] = order.date.split("/");
          const key = `Tháng ${Number(month)}`;
          monthRevenue[key] = (monthRevenue[key] || 0) + order.total_price;
        });

        // Sắp xếp theo tháng tăng dần
        const sortedData = Object.entries(monthRevenue)
          .sort((a, b) => {
            const getMonthNumber = (text: string) => parseInt(text.replace("Tháng ", ""));
            return getMonthNumber(a[0]) - getMonthNumber(b[0]);
          })
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
        const response = await fetch('https://gshopbackend-1.onrender.com/order/revenue');
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
        console.error('Lỗi khi lấy dữ liệu doanh thu:', error);
      }
    };

    fetchRevenueData();
  }, []);

  const cardData: CardProps[] = [
    {
      label: 'Tổng toàn bộ doanh thu',
      amount: `${revenueData.totalRevenue.toLocaleString()} đ`,
      discription: 'Doanh thu sản phẩm đã bán',
      icon: Landmark,
    },
    {
      label: 'Tổng doanh thu hôm nay',
      amount: `${revenueData.toDayRevenue.toLocaleString()} đ`,
      discription: 'Số tiền kiếm được trong hôm nay',
      icon: HandCoinsIcon,
    },
    {
      label: 'Tổng đơn hàng đã giao',
      amount: revenueData.toDayOrders.toString(),
      discription: 'Tất cả đơn hàng đã giao thành công',
      icon: ShoppingCart,
    },
  ];

  const [categoryRatioData, setCategoryRatioData] = useState<{ name: string; percentage: string }[]>([]);

  useEffect(() => {
    const fetchTopProductsData = async () => {
      try {
        const response = await fetch('https://gshopbackend-1.onrender.com/order/top-products');
        const result = await response.json();
        if (result.status) {
          setCategoryRatioData(result.categoryRatio);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tỉ lệ loại Gundam:', error);
      }
    };

    fetchTopProductsData();
  }, []);
  const pieChartDataFromApi = categoryRatioData.map((item, index) => ({
    id: index,
    value: parseFloat(item.percentage),
    name: `${item.name} (${item.percentage})`,
  }));



  return (
    <div>
      <section className="grid w-full pb-4 grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-3">
        {cardData.map((d, i) => (
          <Card key={i} amount={d.amount} discription={d.discription} icon={d.icon} label={d.label} />
        ))}
      </section>
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-[7fr_3fr]">
        <section className="grid grid-cols-1 gap-4 transition-all">
          <CardContent>
            <p className=" font-semibold">Thống kê doanh thu</p>
            <p className="pb-4 text-xs text-gray-500">Doanh thu trong năm nay</p>
            <LineChart data={Object.entries(revenueData.dailyRevenueLast7Days).reverse().map(([date, value]) => ({ name: date, total: Number(value) }))} />
          </CardContent>
          <CardContent>
            <p className=" font-semibold">Thống kê lợi nhuận theo tháng</p>
            <p className="pb-4 text-xs text-gray-500">Tổng doanh thu của các đơn hàng đã giao</p>
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
            <p className="font-semibold pb-2">Tỉ lệ loại Gundam trên tổng số đã bán</p>
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
