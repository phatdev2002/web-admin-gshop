'use client'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: "06/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "07/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "08/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "09/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "10/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "11/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "12/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "13/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "14/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "15/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "16/01/2024", total: Math.floor(Math.random() * 500000) + 100000 },
];

export default function LineGraphComponent() {
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
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <Line dataKey="total" stroke="#E43727" />
      </LineChart>
    </ResponsiveContainer>
  );
}
