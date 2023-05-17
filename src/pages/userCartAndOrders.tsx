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

    const cartProductsApi = api.cart.getCartsItems.useQuery(undefined, { enabled: false });
    const ordersApi = api.order.getAllOdersByClient.useQuery(undefined, { enabled: false });

    const createOrderApi = api.order.createOrder.useMutation();

    const clientCompany = api.client.getClientCompany.useQuery(undefined, { enabled: false });

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await cartProductsApi.refetch();
            if (data) setCartProducts(data);

            const companyData = await clientCompany.refetch();
            if (companyData.data) setCurrentEntity(companyData.data.company);

            await ordersApi.refetch();
        }

        fetchData()
            .catch(console.error);
    }, [])

    const handleClick = handleErrors(async () => {
        if (cartProducts && cartProducts?.length > 0) {
            const summ = cartProducts.reduce((summ, value) => summ + value.amount * value.product.price, 0)
            const cartProductsData: { productId: string; amount: number }[] = [];
            cartProducts?.forEach(item => cartProductsData.push({ productId: item.productId, amount: item.amount }));

            await createOrderApi.mutateAsync({
                summ: summ,
                cartProducts: cartProductsData,
                companyId: currentEntity?.companyId || null
            })

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
                        <div className="flex flex-col gap-2">
                            {
                                currentEntity &&
                                <>
                                    <FormControlLabel control={<Switch onChange={(e) => handleSwitchChange(e)} />} label="Совершить покупку от имении юр. лица" />
                                    {
                                        isEntity &&
                                        <div>
                                            <div>Юридическое лицо: {currentEntity.companyName} {currentEntity?.inn}</div>
                                        </div>
                                    }
                                </>
                            }
                            {
                                cartProducts && cartProducts.length > 0 &&
                                <button onClick={handleClick} className="p-3 w-fit rounded-xl text-white bg-blue-400 hover:bg-red-500
                                   hover:text-black transition duration-300 ease-in-out">Заказать</button>
                            }

                        </div>
                    </div>
                    <div className="bg-white w-10/12 h-2/3 m-auto mt-4 rounded-lg p-4">
                        {
                            ordersApi.data && ordersApi.data.length > 0 &&
                            ordersApi.data.map(item => {
                                return (
                                    <Accordion key={item.orderId}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Заказ на {item.summ} РУБ. Статус: {orderStatusDict[`${item.orderStatus}`]}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {
                                                item.productsOfOrder &&
                                                item.productsOfOrder.map(product => {
                                                    return (
                                                        <OrderItem key={product.productId} orderProduct={product} />
                                                    );
                                                })
                                            }
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })
                        }
                    </div>
                </main>
            </CartContext.Provider >
        </>
    );
};

export default UserCartAndOrdersPage;
