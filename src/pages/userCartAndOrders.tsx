import { Product, ProductsInCart } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import CartContext from "~/Context/CartContext";
import CartItem from "~/components/cart/CartItem";
import { api } from "~/utils/api";
import handleErrors from "~/utils/handleErrors";

const userCartAndOrdersPage: NextPage = () => {
    const [cartProducts, setCartProducts] = useState<(ProductsInCart & { product: Product })[] | undefined>(undefined);
    const cartProductsApi = api.cart.getCartsItems.useQuery(undefined, { enabled: false });

    const createOrderApi = api.order.createOrder.useMutation();
    const createOrderInElmaApi = api.order.createOrderInElma.useMutation();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await cartProductsApi.refetch();
            if (data) setCartProducts(data);
        }

        fetchData()
            .catch(console.error);
    }, [])

    const handleClick = handleErrors(async () => {
        const summ = cartProducts!.reduce((summ, value) => summ + value.amount * value.product.price, 0)
        const cartProductsData: { productId: string; amount: number }[] = [];
        cartProducts?.forEach(item => cartProductsData.push({ productId: item.productId, amount: item.amount }));

        const order = await createOrderApi.mutateAsync({
            summ: summ,
            cartProducts: cartProductsData
        })

        const elmaData: { product: string[], amount: number }[] = [];
        cartProductsData.forEach(item => elmaData.push({
            product: [item.productId],
            amount: item.amount
        }))

        await createOrderInElmaApi.mutateAsync({
            context: {
                __id: order.orderId,
                client: [order.clientId],
                order: {
                    rows: elmaData
                }
            }
        });
    });

    return (
        <>
            <CartContext.Provider value={{ cartProducts: cartProducts, cartProductsSetter: setCartProducts }}>
                <Head>
                    <title>E-Shop</title>
                    <meta name="description" content="CRM Furniture" />
                </Head>
                <main>
                    <div className="bg-white w-10/12 h-2/3 m-auto mt-4 rounded-lg p-4">
                        <div className="text-xl font-roboto">Корзина пользователя</div>
                        <div>
                            {
                                cartProducts
                                && cartProducts.map(cartProduct => {
                                    return (
                                        <CartItem key={cartProduct.productId} cartProduct={cartProduct} />
                                    )
                                })
                            }
                            {
                                cartProducts && cartProducts.length > 0 &&
                                <div className="text-lg font-roboto">
                                    Итого: {cartProducts.reduce((summ, value) => summ + value.amount * value.product.price, 0)} РУБ.
                                </div>
                            }
                        </div>
                        <button onClick={handleClick} className="">Create Order</button>
                    </div>
                </main>
            </CartContext.Provider>
        </>
    );
};

export default userCartAndOrdersPage;
