import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { Product, ProductsInCart } from "@prisma/client";
import Image from 'next/image';

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
                                    <div className="flex justify-center h-[100px] relative rounded-3xl shadow-inner shadow-primary border-2 aspect-square bg-primary">
                                        <Image src={`data:image/jpeg;base64, ${productInCart.product.productImg}`} className='object-contain p-4' fill alt=""></Image>
                                    </div>
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