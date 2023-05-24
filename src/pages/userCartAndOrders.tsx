import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, Switch, Typography } from "@mui/material";
import { Client, Company, Product, ProductsInCart } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import CartContext from "~/Context/CartContext";
import CartItem from "~/components/cart/CartItem";
import { api } from "~/utils/api";
import handleErrors from "~/utils/handleErrors";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OrderItem from "~/components/cart/OrderItem";
import OrderTable from "~/components/tables/OrderTable";
import CartTable from "~/components/tables/CartTable";

const orderStatusDict = {
    distribution: "На распределении",
    processing: "В обработке",
    manufacturing: "На производстве",
    delivery: "В доставке",
    close: "Успешно закрыто",
    canceled: "Отменена"
}

const UserCartAndOrdersPage: NextPage = () => {
    const [cartProducts, setCartProducts] = useState<(ProductsInCart & { product: Product })[] | undefined>(undefined);
    const [isEntity, setIsEntity] = useState(false);
    const [currentEntity, setCurrentEntity] = useState<Company | null>(null);

    const cartProductsApi = api.cart.getCartsItems.useQuery(undefined, {
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        onSuccess: (data) => {
            setCartProducts(data);
        }
    });
    const ordersApi = api.order.getAllOdersByClient.useQuery(undefined, {
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    });

    const clientCompany = api.client.getClientCompany.useQuery(undefined, {
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        onSuccess(data) {
            if (data) setCurrentEntity(data.company);
        },
    });

    const createOrderApi = api.order.createOrder.useMutation();

    const handleClick = handleErrors(async () => {
        if (cartProducts && cartProducts?.length > 0) {
            const summ = cartProducts.reduce((summ, value) => summ + value.amount * value.product.price, 0)
            const cartProductsData: { productId: string; amount: number }[] = [];
            cartProducts?.forEach(item => cartProductsData.push({ productId: item.productId, amount: item.amount }));

            createOrderApi.mutate({
                summ: summ,
                cartProducts: cartProductsData,
                companyId: isEntity ? currentEntity?.companyId || null : null
            })
            console.log(createOrderApi.isLoading);

            setCartProducts(undefined);
            await ordersApi.refetch();
        }

    });

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEntity(e.target.checked);
    }

    return (
        <>
            <CartContext.Provider value={{ cartProducts: cartProducts, cartProductsSetter: setCartProducts }}>
                <Head>
                    <title>E-Shop</title>
                    <meta name="description" content="CRM Furniture" />
                </Head>
                <main>
                    {
                        cartProducts && cartProducts.length > 0 &&
                        <div className="bg-secondary w-10/12 h-2/3 m-auto mt-4 rounded-lg p-4">
                            <div className="text-xl">Корзина пользователя</div>
                            <div>
                                {
                                    cartProducts && <CartTable productsInCart={cartProducts}/>
                                }
                                {
                                    cartProducts && cartProducts.length > 0 &&
                                    <div className="font-roboto my-4">
                                        Итого: {cartProducts.reduce((summ, value) => summ + value.amount * value.product.price, 0)} РУБ.
                                    </div>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                {
                                    currentEntity &&
                                    <>
                                        <FormControlLabel control={<Switch onChange={(e) => handleSwitchChange(e)} />} label={`Совершить покупку от имении ${currentEntity.companyName} ${currentEntity?.inn}`} />
                                    </>
                                }
                                {
                                    cartProducts && cartProducts.length > 0 &&
                                    <button onClick={handleClick} className="p-3 w-fit rounded-xl text-white bg-primary hover:bg-accent
                                   hover:text-black transition duration-300 ease-in-out">Заказать</button>
                                }

                            </div>
                        </div>
                    }
                    {
                        ordersApi.data && ordersApi.data.length > 0 &&
                        <div className="bg-secondary w-10/12 h-2/3 m-auto mt-4 rounded-lg p-4">
                            <div className="font-roboto mb-2">Заказы пользователя</div>
                            {
                                ordersApi.data && ordersApi.data.length > 0 &&
                                ordersApi.data.map(item => {
                                    return (
                                        <Accordion key={item.orderId} sx={{border: '1px solid #7C7C7C', borderRadius: '12px'}}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className="text-sm">Заказ на {item.summ} РУБ. Статус: {orderStatusDict[`${item.orderStatus}`]}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <OrderTable order={item} />
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })
                            }
                        </div>
                    }
                </main>
            </CartContext.Provider >
        </>
    );
};

export default UserCartAndOrdersPage;
