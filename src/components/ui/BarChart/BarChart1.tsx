'use client'
import React from 'react'
import {
  Bar,
  BarChart as BarGraph,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type ChartData = {
  name: string; // ví dụ: "Tháng 3"
  total: number; // số lượng đơn đã giao trong tháng
};

export default function BarChart({ data }: { data: ChartData[] }) {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow p-2 rounded text-sm border border-gray-200">
          {`${payload[0].value.toLocaleString()} đơn`}
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
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={30} fill="#266FDA" />
      </BarGraph>
    </ResponsiveContainer>
  );
}
