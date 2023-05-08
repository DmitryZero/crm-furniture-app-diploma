import { Product, ProductsInCart } from "@prisma/client"
import Image from 'next/image';
import AddToCardButton from "../AddToCartBtn";
import CartContext from "~/Context/CartContext";
import { useContext } from "react";

interface IProps {
    cartProduct: ProductsInCart & { product: Product },    
}

export default function CartItem({ cartProduct }: IProps) {    
    const contextController = useContext(CartContext);

    return (
        <>
            <div className='mb-5 grid grid-cols-9 items-center gap-4 border-2 hover:bg-slate-50 transition duration-300 ease-in-out'>
                <Image src={`data:image/jpeg;base64, ${cartProduct.product.productImg}`} className='rounded-full col-span-1 p-2' width={100} height={100} alt=""></Image>
                <div className='col-span-5'>{cartProduct.product.productName}</div>
                <div className='col-span-3 p-4'>
                    <AddToCardButton productId={cartProduct.productId}></AddToCardButton>
                </div>
            </div>
        </>
    )
}