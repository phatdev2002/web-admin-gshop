'use client'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

interface LineGraphProps {
  data: { name: string; total: number }[];
}

export default function LineGraphComponent({ data }: LineGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
        <YAxis 
          width={80}
          tickLine={false} 
          axisLine={false} 
          stroke="#888888" 
          fontSize={13} 
          tickFormatter={(value) => value.toLocaleString()} 
        />
        <Line dataKey="total" stroke="#E43727" />
      </LineChart>
    </ResponsiveContainer>
  );
}
