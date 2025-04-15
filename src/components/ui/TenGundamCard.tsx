import React from 'react'


export type TenGundamProps = {
    name: string;
    amount: string;
}

export default function TenGundamCard(props: TenGundamProps) {
  return (
    <div className='flex justify-around my-2'>
        <p className=' flex-1'>
                {props.name}           
        </p>
        <p className='ml-2 flex font-semibold'>{props.amount}</p>
    </div>
  )
}