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
                <div className="bg-white
                                  rounded-md
                                  p-3
                                  text-base
                                  border-2
                                  border-transparent
                                  hover:border-gray-400
                                  transition
                                  ease-in-out
                                  duration-150
                                  cursor-pointer">
                    <div className="relative min-h-[200px]">
                        <Image className="object-contain" fill src={`data:image/jpeg;base64, ${product.productImg}`} alt=""></Image>
                    </div>
                    <div className="text-lg">{product.productName}</div>
                    <div className="text-end text-red-500 text-lg">{product.price} РУБ.</div>
                </div>
            </Link>
        </>
    )
}