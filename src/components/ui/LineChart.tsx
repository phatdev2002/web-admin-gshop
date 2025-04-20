'use client'
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  TooltipProps
} from 'recharts'
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'

interface LineGraphProps {
  data: { name: string; total: number }[];
}

// ✅ Custom Tooltip content
const CustomTooltip = ({
  active,
  payload,
  label
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded bg-white p-2 shadow border text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-red-600">{Number(payload[0].value).toLocaleString()} đ</p>
      </div>
    );
  }

  return null;
};

export default function LineGraphComponent({ data }: LineGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          width={80}
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={13}
          tickFormatter={(value) => value.toLocaleString()}
        />
        
        {/* ✅ Dùng CustomTooltip để bỏ chữ "total" */}
        <Tooltip content={<CustomTooltip />} />

        <Line dataKey="total" stroke="#E43727" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
