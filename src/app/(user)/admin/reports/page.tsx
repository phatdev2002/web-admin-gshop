"use client";
import React, { useEffect, useState } from 'react';
import BarChart from '@/components/ui/BarChart';
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
      discription: 'Số khách đã mua hàng',
      icon: Landmark,
    },
    {
      label: 'Tổng doanh thu hôm nay',
      amount: `${revenueData.toDayRevenue.toLocaleString()} đ`,
      discription: 'Số tiền kiếm được hôm nay',
      icon: HandCoinsIcon,
    },
    {
      label: 'Tổng đơn hàng hôm nay',
      amount: revenueData.toDayOrders.toString(),
      discription: 'Các đơn hàng đã giao thành công',
      icon: ShoppingCart,
    },
  ];

  const pieData = [
    { id: 0, value: 100, label: 'High Grade' },
    { id: 1, value: 54, label: 'Master Grade' },
    { id: 2, value: 25, label: 'Real Grade' },
    { id: 3, value: 30, label: 'Super Deformed' },
    { id: 4, value: 10, label: 'Perfect Grade' },
    { id: 5, value: 10, label: 'Entry Grade' },
  ];

  const total = pieData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = pieData.map((item) => ({
    ...item,
    label: `${item.label} (${((item.value / total) * 100).toFixed(0)}%)`,
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
            <p className=" font-semibold">Thống kê đơn đặt hàng</p>
            <p className="pb-4 text-xs text-gray-500">Chờ gọi API ( HIỆN ĐANG CODE CỨNG )</p>
            <BarChart />
          </CardContent>
        </section>
        <section>
          <CardContent>
            <section>
              <p className="font-semibold">Tỉ lệ bán chạy của các loại Gundam</p>
              <p className="pb-4 text-xs text-gray-500">Chờ gọi API ( HIỆN ĐANG CODE CỨNG )</p>
            </section>
            <PieChartComponent piedata={dataWithPercentage.map(({ label, ...rest }) => ({ name: label, ...rest }))} />
          </CardContent>
        </section>
      </section>
    </div>
  );
};

export default ReportPage;
