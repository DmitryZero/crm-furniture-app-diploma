import { Product } from "@prisma/client"
import Image from 'next/image';
import Link from "next/link";

interface IProps {
    product: Product
}

export default function ProductCard({ product }: IProps) {
    return (
        <>
            <Link href={`/products/${product.productId}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="bg-secondary
                                  rounded-md
                                  p-3
                                  border-2
                                  border-transparent
                                  hover:border-gray-400
                                  transition
                                  ease-in-out
                                  duration-150
                                  cursor-pointer
                                  h-full
                                  shadow-sm
                                  grid grid-rows-12">
                    <div className="relative min-h-[200px] row-span-10">
                        <Image className="object-contain" fill src={`data:image/jpeg;base64, ${product.productImg}`} alt=""></Image>
                    </div>
                    <div className="row-span-1 mt-2">{product.productName}</div>
                    <div className="text-end text-red-500 row-span-1">{product.price} РУБ.</div>
                </div>
            </Link>
        </>
    )
}