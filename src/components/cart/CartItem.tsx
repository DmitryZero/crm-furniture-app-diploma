import type { Product, ProductsInCart } from "@prisma/client"
import Image from 'next/image';
import AddToCardButton from "../AddToCartBtn";

interface IProps {
    cartProduct: ProductsInCart & { product: Product },    
}

export default function CartItem({ cartProduct }: IProps) {    
    // const contextController = useContext(CartContext);

    return (
        <>
            <div className='mb-5 grid grid-cols-9 items-center gap-4 border-2 hover:bg-slate-50 transition duration-300 ease-in-out'>
                <Image src={`data:image/jpeg;base64, ${cartProduct.product.productImg}`} className='rounded-full col-span-1 p-2' width={100} height={100} alt=""></Image>
                <div className='col-span-6'>{cartProduct.product.productName}</div>
                <div className='col-span-2 flex justify-end p-2'>
                    <AddToCardButton productId={cartProduct.productId}></AddToCardButton>
                </div>
            </div>
        </>
    )
}