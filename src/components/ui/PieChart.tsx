
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieChartComponent({ piedata }) {
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <PieChart
        colors={['#37A1EB', '#4AC1C0', '#FECD58', '#FF9E44', '#FF6484', '#9967FD']}
          series={[
            {
              data: piedata,
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
              position: { vertical: 'bottom', horizontal: 'middle' }, // Chú thích nằm dưới biểu đồ
              padding: 20, // Khoảng cách giữa biểu đồ và chú thích
            },
          }}
        />
      </div>
    </div>
  );
}