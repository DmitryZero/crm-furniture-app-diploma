import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Order, productsOfOrder, Product, ProductsInCart } from "@prisma/client";
import Image from 'next/image';
import AddToCardButton from "../AddToCartBtn";
import { Dispatch, SetStateAction } from "react";

interface IProps {
    productsInCart: (ProductsInCart & {
        product: Product;
    })[]
}

export default function CartTable({ productsInCart }: IProps) {

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Продукт</TableCell>
                        <TableCell align="left">Название</TableCell>
                        <TableCell align="right">Количество</TableCell>
                        <TableCell align="right">Цена за 1 шт.</TableCell>
                        <TableCell align="right">Сумма</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        productsInCart.map((productInCart) => (
                            <TableRow key={productInCart.productId}>
                                <TableCell component="th" scope="row" align="left">
                                    <Image src={`data:image/jpeg;base64, ${productInCart.product.productImg}`} className='rounded-full col-span-1 p-2' width={100} height={100} alt=""></Image>
                                </TableCell>
                                <TableCell align="left">{productInCart.product.productName}</TableCell>
                                <TableCell align="right">
                                    {productInCart.amount}
                                </TableCell>
                                <TableCell align="right">{productInCart.product.price}</TableCell>
                                <TableCell align="right">{productInCart.amount * productInCart.product.price}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}