import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { Order, productsOfOrder, Product } from "@prisma/client";
import Image from 'next/image';

interface IProps {
    order: (Order & {
        productsOfOrder: (productsOfOrder & {
            product: Product;
        })[];
    })
}

export default function OrderTable({ order }: IProps) {
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <TableCell>Продукт</TableCell>
                        <TableCell align="left">Название</TableCell>
                        <TableCell align="center">Количество</TableCell>
                        <TableCell align="center">Цена за 1 шт.</TableCell>
                        <TableCell align="right">Сумма</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        order.productsOfOrder.map((productOfOrder) => (
                            <TableRow key={productOfOrder.productId}>
                                <TableCell component="th" scope="row" align="left">
                                    <div className="h-[100px] relative rounded-3xl shadow-inner shadow-primary border-2 aspect-square bg-primary">
                                        <Link href={`/products/${productOfOrder.productId}`} className="cursor-pointer">
                                            <div className="relative h-[100px]">
                                                <Image src={productOfOrder.product.productSrc} className='object-contain p-4' fill alt=""></Image>
                                            </div>
                                        </Link>
                                    </div>
                                </TableCell>
                                <TableCell align="left">{productOfOrder.product.productName}</TableCell>
                                <TableCell align="center">{productOfOrder.amount}</TableCell>
                                <TableCell align="center">{productOfOrder.product.price.toLocaleString()}</TableCell>
                                <TableCell align="right">{(productOfOrder.amount * productOfOrder.product.price).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}