'use client'
import React from 'react'
import {Bar, BarChart as BarGraph, ResponsiveContainer, XAxis, YAxis} from "recharts";
type Props = {}

const data = [
  {
    name: "06/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
  {
    name: "07/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
  {
    name: "08/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
  {
    name: "09/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
  {
    name: "10/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
  {
    name: "11/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
  {
    name: "12/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
  {
    name: "13/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
  {
    name: "14/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
  {
    name: "15/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
  {
    name: "16/01/2024",
    total: Math.floor(Math.random()*50)+10,
  },
]

export default function BarChart({}: Props) {
  return (
    <ResponsiveContainer width={'100%'} height={350}>
      <BarGraph data={data}>
        <XAxis dataKey={"name"}
        tickLine = {false}
        axisLine={false}
        stroke='#888888'
        fontSize={12}/>
        <YAxis 
        tickLine = {false}
        axisLine={false}
        stroke='#888888'
        fontSize={12}/>
        <Bar dataKey={"total"} radius={[4,4,0,0]} barSize={30} fill="#266FDA"/>
      </BarGraph>
    </ResponsiveContainer>
  )
}