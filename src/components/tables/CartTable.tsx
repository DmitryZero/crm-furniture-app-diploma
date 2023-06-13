import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { Product, ProductsInCart } from "@prisma/client";
import Image from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Dispatch, SetStateAction } from "react";
import { api } from "~/utils/api";
import handleErrors from "~/utils/handleErrors";

interface IProps {
    productsInCart: (ProductsInCart & {
        product: Product;
    })[],
    setCartProducts: Dispatch<SetStateAction<(ProductsInCart & {
        product: Product;
    })[] | undefined>>
}

export default function CartTable({ productsInCart, setCartProducts }: IProps) {
    const deleteItem = api.cart.updateCart.useMutation();


    const handleDelete = handleErrors(async (productId: string) => {
        await deleteItem.mutateAsync({ productId: productId, amount: 0 });
        setCartProducts((prevItem) => prevItem?.filter(item => item.productId !== productId));
    })

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Продукт</TableCell>
                        <TableCell align="left">Название</TableCell>
                        <TableCell align="center">Количество</TableCell>
                        <TableCell align="center">Цена за 1 шт.</TableCell>
                        <TableCell align="center">Сумма</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        productsInCart.map((productInCart) => (
                            <TableRow key={productInCart.productId}>
                                <TableCell component="th" scope="row" align="left">
                                    <div className="h-[100px] relative rounded-3xl shadow-inner shadow-primary border-2 aspect-square bg-primary">
                                        <Link href={`/products/${productInCart.productId}`} className="cursor-pointer">
                                            <div className="relative h-[100px]">
                                                <Image src={productInCart.product.productSrc} className='object-contain p-4' fill alt=""></Image>
                                            </div>
                                        </Link>
                                    </div>
                                </TableCell>
                                <TableCell align="left">{productInCart.product.productName}</TableCell>
                                <TableCell align="center">
                                    {productInCart.amount}
                                </TableCell>
                                <TableCell align="center">{productInCart.product.price.toLocaleString()}</TableCell>
                                <TableCell align="center">{(productInCart.amount * productInCart.product.price).toLocaleString()}</TableCell>
                                <TableCell align="right" width="50px">
                                    <div onClick={() => handleDelete(productInCart.productId)} className="bg-primary border-2 border-primary w-fit px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer transition-all">
                                        <DeleteIcon />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}