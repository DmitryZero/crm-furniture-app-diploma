import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Switch } from "@mui/material";
import { Company, Product, ProductsInCart } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import CartContext from "~/Context/CartContext";
import CartItem from "~/components/cart/CartItem";
import { api } from "~/utils/api";
import handleErrors from "~/utils/handleErrors";

const UserCartAndOrdersPage: NextPage = () => {
    const [cartProducts, setCartProducts] = useState<(ProductsInCart & { product: Product })[] | undefined>(undefined);
    const [isEntity, setIsEntity] = useState(false);
    const [currentEntityId, setCurrentEntity] = useState<string>('');

    const cartProductsApi = api.cart.getCartsItems.useQuery(undefined, { enabled: false });

    const createOrderApi = api.order.createOrder.useMutation();    

    const companies = api.company.getAllByClient.useQuery(undefined, { enabled: false });

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await cartProductsApi.refetch();
            if (data) setCartProducts(data);
            
            const {data: companiesData} = await companies.refetch();
            if (companiesData && companiesData.length > 0) setCurrentEntity(companiesData[0]?.companyId || "");
        }

        fetchData()
            .catch(console.error);
    }, [])

    const handleClick = handleErrors(async () => {
        const summ = cartProducts!.reduce((summ, value) => summ + value.amount * value.product.price, 0)
        const cartProductsData: { productId: string; amount: number }[] = [];
        cartProducts?.forEach(item => cartProductsData.push({ productId: item.productId, amount: item.amount }));

        await createOrderApi.mutateAsync({
            summ: summ,
            cartProducts: cartProductsData,
            companyId: currentEntityId
        })        
    });

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEntity(e.target.checked);
    }

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setCurrentEntity(e.target.value);
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
                                companies.data && companies.data.length > 0 &&
                                <>
                                    <FormControlLabel control={<Switch onChange={(e) => handleSwitchChange(e)} />} label="Совершить покупку от имении юр. лица" />
                                    {
                                        isEntity &&
                                        <FormControl fullWidth className="mb-3">
                                            <InputLabel id="demo-simple-select-label">Юридическое лицо</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Юридичесое лицо"
                                                value={currentEntityId}
                                                onChange={handleSelectChange}
                                            >
                                                {
                                                    companies.data && companies.data?.length > 0 &&
                                                    companies.data?.map(company => {
                                                        return (
                                                            <MenuItem key={company.companyId} value={company.companyId}>{company.companyName}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    }
                                </>
                            }
                            <button onClick={handleClick} className="p-3 w-fit rounded-xl text-white bg-blue-400 hover:bg-red-500
                                   hover:text-black transition duration-300 ease-in-out">Create Order</button>
                        </div>
                    </div>
                </main>
            </CartContext.Provider>
        </>
    );
};

export default UserCartAndOrdersPage;
