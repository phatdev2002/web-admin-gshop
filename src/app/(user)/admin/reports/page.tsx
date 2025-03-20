
import BarChart from '@/components/ui/BarChart';
import Card, { CardContent, CardProps } from '@/components/ui/Card';
import { HandCoinsIcon, Landmark, ShoppingCart } from 'lucide-react';
import React from 'react';
import LineChart from '@/components/ui/LineChart';
import PieChartComponent from '@/components/ui/PieChart';

const cardData: CardProps[] = [
  {
    label: "Tổng toàn bộ doanh thu",
    amount: "30.000.000.000 đ",
    discription: "Số khách đã mua hàng",
    icon: Landmark,
  },
  {
    label: "Tổng doanh thu hôm nay",
    amount: "400.000.000 đ",
    discription: "Số lượng hàng còn lại",
    icon: HandCoinsIcon,
  },
  {
    label: "Tổng đơn hàng hôm nay",
    amount: "3425",
    discription: "Các đơn hàng đã giao thành công",
    icon: ShoppingCart,
  },
];





const ReportPage = () => {
  const pieData = [
    { id: 0, value: 100, label: "High Grade" },
    { id: 1, value: 54, label: "Master Grade" },
    { id: 2, value: 25, label: "Real Grade" },
    { id: 3, value: 30, label: "Super Deformed" },
    { id: 4, value: 10, label: "Perfect Grade" },
    { id: 5, value: 10, label: "Entry Grade" },
  ];
  // Tính tổng giá trị
const total = pieData.reduce((sum, item) => sum + item.value, 0);

// Thêm phần trăm vào nhãn
const dataWithPercentage = pieData.map((item) => ({
  ...item,
  label: `${item.label} (${((item.value / total) * 100).toFixed(0)}%)`, // Làm tròn phần trăm
}));
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
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-[7fr_3fr]">
        <section className="grid grid-cols-1 gap-4 transition-all">
          <CardContent>
            <p className="p-4 font-semibold">Thống kê doanh thu</p>
            <LineChart />
          </CardContent>
          <CardContent>
            <p className="p-4 font-semibold">Thống kê đơn đặt hàng</p>
            <BarChart />
          </CardContent>
        </section>
        <section>
        <CardContent >
          <section>
            <p className="font-semibold">Tỉ lệ bán chạy của các loại Gundam</p>
          </section>
          <PieChartComponent piedata={dataWithPercentage.map(({ label, ...rest }) => ({ name: label, ...rest }))} />
        </CardContent>
        </section>
      </section>
    </div>
  );
};

export default ReportPage;