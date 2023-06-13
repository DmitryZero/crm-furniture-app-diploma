import { Checkbox, FormControlLabel, Tooltip } from "@mui/material";
import type { Company, Product, ProductsInCart, Document, Order, productsOfOrder } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import CartContext from "~/Context/CartContext";
import { api } from "~/utils/api";
import handleErrors from "~/utils/handleErrors";
import CartTable from "~/components/tables/CartTable";
import OrderItem from "~/components/OrderItem";
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import ManufacturingOrderDialog from "~/components/ManufacturingOrderDialog";
import RefreshIcon from '@mui/icons-material/Refresh';

type TOrder =
    (Order & {
        productsOfOrder: (productsOfOrder & {
            product: Product;
        })[];
        clientDocuments: Document[];
    })

// const orderStatusDict = {
//     distribution: "На распределении",
//     processing: "В обработке",
//     manufacturing: "На производстве",
//     delivery: "В доставке",
//     close: "Успешно закрыто",
//     canceled: "Отменена"
// }

const UserCartAndOrdersPage: NextPage = () => {
    const [cartProducts, setCartProducts] = useState<(ProductsInCart & { product: Product })[] | undefined>(undefined);
    const [isEntity, setIsEntity] = useState(false);
    const [currentEntity, setCurrentEntity] = useState<Company | null>(null);
    const [allOrders, setAllOrders] = useState<TOrder[]>([])

    const [openDialog, setOpenDialog] = useState(false);

    api.cart.getCartsItems.useQuery(undefined, {
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
        refetchOnReconnect: true,
        onSuccess: (data) => {
            if (data) setAllOrders(data)
        }
    });

    api.client.getClientCompany.useQuery(undefined, {
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        onSuccess(data) {
            if (data) setCurrentEntity(data.company);
        },
    });

    const createOrderApi = api.order.createRegularOrder.useMutation();

    const updateOrderList = handleErrors(async () => {
        const {data} = await ordersApi.refetch();
        if (data) setAllOrders(data);
    });

    const handleClick = handleErrors(async () => {
        if (cartProducts && cartProducts?.length > 0) {
            const summ = cartProducts.reduce((summ, value) => summ + value.amount * value.product.price, 0)
            const cartProductsData: { productId: string; amount: number }[] = [];
            cartProducts?.forEach(item => cartProductsData.push({ productId: item.productId, amount: item.amount }));

            createOrderApi.mutate({
                summ: summ,
                cartProducts: cartProductsData,
                company: isEntity ? currentEntity : null
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
                <main className="overflow-y-auto">
                    <div className="bg-secondary w-10/12 h-2/3 m-auto mt-4 rounded-lg p-4">
                        <div className="text-xl mb-2">Корзина пользователя</div>
                        <div>
                            {
                                cartProducts && cartProducts.length > 0
                                    ? cartProducts && <CartTable setCartProducts={setCartProducts} productsInCart={cartProducts} />
                                    : <div className="text-text text-md" >В корзине нет товаров</div>
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
                                cartProducts && cartProducts.length > 0 &&
                                <>
                                    {
                                        currentEntity &&
                                        <FormControlLabel required control={
                                            <Checkbox
                                                checked={isEntity}
                                                onChange={handleSwitchChange}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        } label={`Совершить покупку от имении ${currentEntity.companyName} ${currentEntity?.inn}`} />
                                    }
                                    <button onClick={handleClick} className="p-3 w-fit rounded-xl text-white bg-primary hover:bg-accent
                                   hover:text-black transition duration-300 ease-in-out">Заказать</button>
                                </>
                            }

                        </div>
                    </div>

                    <div className="bg-secondary w-10/12 h-2/3 m-auto mt-4 rounded-lg p-4 relative">
                        <div className="flex gap-3 align-middle mb-3">
                            <div className="font-roboto mb-2 text-xl">Заказы пользователя</div>
                            <button onClick={updateOrderList} className="p-1 border-2 border-primary w-fit aspect-square rounded-full text-white bg-primary hover:bg-white
                                       hover:text-black hover:border-black transition duration-300 ease-in-out">
                                <RefreshIcon />
                            </button>
                        </div>
                        {
                            allOrders && allOrders.length > 0
                                ? allOrders.map(item => {
                                    return (
                                        <OrderItem key={item.orderId} item={item} />
                                    );
                                })
                                : <div className="text-text text-md" >Нет созданных заказов</div>
                        }
                    </div>
                    <Tooltip placement="left" title="Индвидуальный заказ">
                        <button onClick={() => setOpenDialog(true)} className="fixed right-10 bottom-10 p-3 border-2 border-primary w-fit aspect-square rounded-full text-white bg-primary hover:bg-white
                                   hover:text-black hover:border-black transition duration-300 ease-in-out">
                            <ChairOutlinedIcon />
                        </button>
                    </Tooltip>
                    <ManufacturingOrderDialog setCurrentEntity={setCurrentEntity} openDialog={openDialog} setOpenDialog={setOpenDialog} entity={currentEntity} />
                </main>
            </CartContext.Provider >
        </>
    );
};

export default UserCartAndOrdersPage;
