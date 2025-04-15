'use client'
import React from 'react'
import {
  Bar,
  BarChart as BarGraph,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip, // 👈 THÊM DÒNG NÀY
} from "recharts";


type ChartData = {
  name: string; // ví dụ: "Tháng 3"
  totalRevenue: number; // tổng doanh thu trong tháng (nếu cần)
};

export default function BarChart2({ data }: { data: ChartData[] }) {
  
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow p-2 rounded text-sm border border-gray-200">
          {`${payload[0].value.toLocaleString()} đ`}
        </div>
      );
    }
    return null;
  };
  
  return (
    <ResponsiveContainer width={'100%'} height={350}>
      <BarGraph data={data}>
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => {
            if (value >= 1_000_000_000) return `${value / 1_000_000_000} tỷ`;
            if (value >= 1_000_000) return `${value / 1_000_000} tr`;
            if (value >= 1_000) return `${value / 1_000}k`;
            return value;
          }}
          
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={"totalRevenue"} radius={[4, 4, 0, 0]} barSize={30} fill="#266FDA" />
      </BarGraph>
    </ResponsiveContainer>
  );
}
