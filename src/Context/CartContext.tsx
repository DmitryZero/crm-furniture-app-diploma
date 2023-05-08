import type { Product, ProductsInCart } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

interface ICartContext {
    cartProducts: (ProductsInCart & { product: Product })[] | undefined
    cartProductsSetter: Dispatch<SetStateAction<(ProductsInCart & { product: Product })[] | undefined>> | undefined
}

const CartContext = createContext<ICartContext>({
    cartProducts: undefined,
    cartProductsSetter: undefined,
});

export default CartContext;