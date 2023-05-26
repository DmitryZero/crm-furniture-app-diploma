import type { Product, productsOfOrder } from "@prisma/client"
import Image from 'next/image';

interface IProps {
    orderProduct: productsOfOrder & {
        product: Product;
    },    
}

export default function OrderItem({ orderProduct }: IProps) {   
    return (
        <>
            <div className='mb-5 grid grid-cols-9 items-center gap-4 border-2 hover:bg-slate-50 transition duration-300 ease-in-out'>
                <Image src={`data:image/jpeg;base64, ${orderProduct.product.productImg}`} className='rounded-full col-span-1 p-2' width={100} height={100} alt=""></Image>
                <div className='col-span-6'>{orderProduct.product.productName}</div>
                <div className='col-span-2 flex justify-end p-2'>
                    {orderProduct.amount}
                </div>
            </div>
        </>
    )
}