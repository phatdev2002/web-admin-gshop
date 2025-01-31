import PageTitle from '@/components/PageTitle'
import BarChart from '@/components/ui/BarChart'
import Card, { CardContent, CardProps } from '@/components/ui/Card'
import TenGundamCard, { TenGundamProps } from '@/components/ui/TenGundamCard'
import { BookCheck, BoxesIcon, UserCircle, UserSquare2 } from 'lucide-react'
import React from 'react'
import LineChart from '@/components/ui/LineChart'

const cardData: CardProps[] = [
  {
    label: "Tổng khách hàng",
    amount: "3000",
    discription: "Số khách đã mua hàng",
    icon: UserCircle
  },
  {
    label: "Tổng sản phẩm",
    amount: "120",
    discription: "Số lượng hàng còn lại",
    icon: BoxesIcon
  },
  {
    label: "Tổng đơn hàng",
    amount: "245",
    discription: "Các đơn hàng đã giao thành công",
    icon: BookCheck
  },
  {
    label: "Tổng nhân viên",
    amount: "7",
    discription: "Số lượng nhân viên đang làm việc",
    icon: UserSquare2
  },
]

const gundamData: TenGundamProps[] = [
  {
    name: "Rx 78-2",
    amount: "8.500 bộ"
  },
  {
    name: "Wing Gundam Zero",
    amount: "7.800 bộ"
  },
  {
    name: "Strike Freedom Gundam",
    amount: "6.900 bộ"
  },
  {
    name: "Unicorn Gundam",
    amount: "6.500 bộ"
  },
  {
    name: "Gundam Exia",
    amount: "6.200 bộ"
  },
  {
    name: "Zeta Gundam",
    amount: "5.800 bộ"
  },
  {
    name: "Nu Gundam",
    amount: "5.400 bộ"
  },
  {
    name: "Strike Gundam",
    amount: "5.100 bộ"
  },
  {
    name: "Barbatos Gundam",
    amount: "4.800 bộ"
  },
  {
    name: "Sazabi",
    amount: "4.300 bộ"
  },
]
const OverviewPage = () => {
  return (
    <div>
      <PageTitle title="Tổng quan hệ thống"/>
      <section className='grid w-full py-4 grid-cols-1 gap-4 gap-x-8 transition-all
      sm:grid-cols-2 xl:grid-cols-4'>
        {cardData.map((d,i) =>(
          <Card 
          key={i}
          amount={d.amount}
          discription={d.discription}
          icon={d.icon}
          label={d.label}
          />
        ))}
      </section>
      <section className='grid grid-cols-1 gap-4 transition-all lg:grid-cols-[7fr_3fr]'>
        <section className='grid grid-cols-1 gap-4 transition-all'>
          <CardContent>
            <p className='p-4 font-semibold'>Thống kê doanh thu</p>
            <LineChart/>
          </CardContent>
          <CardContent>
            <p className='p-4 font-semibold'>Thống kê đơn đặt hàng</p>
            <BarChart/>
          </CardContent>
        </section>
        <section>
          <CardContent>
            <section>
              <p  className='font-semibold'>Xếp hạng 10 bộ Gundam bán chạy nhất</p>
            </section>
            {gundamData.map((d,i)=>(
              <TenGundamCard key={i}
              name={d.name}
              amount={d.amount}/>
            ))}
            
          </CardContent>
        </section>
      </section>
    </div>
  )
}

export default OverviewPage
