import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

interface PieChartComponentProps {
  piedata: { name: string; value: number }[];
}

export default function PieChartComponent({ piedata }: PieChartComponentProps) {
  const formattedData = [...piedata]
  .sort((a, b) => b.value - a.value) // sắp xếp giảm dần theo value
  .map((item) => ({
    id: item.name,
    value: item.value,
    label: item.name,
  }));



  return (
    <div style={{ display: 'flex' }}>
      <PieChart
        colors={['#37A1EB', '#4AC1C0', '#FECD58', '#FF9E44', '#FF6484', '#9967FD']}
        series={[
          {
            data: formattedData,
            innerRadius: 50,
            paddingAngle: 5,
            cornerRadius: 5,
            cx: 170,
            cy: 150,
          },
        ]}
        width={350}
        height={500}
        slotProps={{
          legend: {
            direction: 'column',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 20,
          },
        }}
      />
    </div>
  );
}
