import React from 'react'


export type TenGundamProps = {
    name: string;
    amount: string;
}

export default function TenGundamCard(props: TenGundamProps) {
  return (
    <div className='flex flex-wrap justify-between gap-3'>
        <div className='text-sm'>
            <p>
                {props.name}
            </p>
        </div>
        <p>{props.amount}</p>
    </div>
  )
}