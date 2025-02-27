import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react'

export type CardProps = {
    label: string;
    icon: LucideIcon;
    amount: string;
    discription: string;
}

export default function Card(props: CardProps) {
  return (
    <CardContent>
        <section className='flex flex-row items-center justify-between'>
            <section>
                <section className='flex justify-between gap-2 mb-3'>
                    <p className='text-sm'>{props.label}</p>
                </section>
                <section className=' flex flex-col gap-1'>
                    <h2 className='text-2xl font-semibold'>{props.amount}</h2>
                    <p className='text-xs text-gray-500'>{props.discription}</p>
                </section>
            </section>
            <props.icon className='h-10 w-10 text-[#E43727]' />
        </section>
        
    </CardContent>
  )
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
        {...props}
        className={cn('flex w-full flex-col gap-2 rounded-xl border p-5 shadow bg-white',props.className)}/>
    )
}