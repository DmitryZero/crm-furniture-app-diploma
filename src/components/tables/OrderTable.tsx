import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Order, productsOfOrder, Product } from "@prisma/client";
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
                        <TableCell align="right">Название</TableCell>
                        <TableCell align="right">Количество</TableCell>
                        <TableCell align="right">Цена за 1 шт.</TableCell>
                        <TableCell align="right">Сумма</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        order.productsOfOrder.map((productOfOrder) => (
                            <TableRow key={productOfOrder.productId}>
                                <TableCell component="th" scope="row">
                                    <Image src={`data:image/jpeg;base64, ${productOfOrder.product.productImg}`} className='rounded-full col-span-1 p-2' width={100} height={100} alt=""></Image>
                                </TableCell>
                                <TableCell align="right">{productOfOrder.product.productName}</TableCell>
                                <TableCell align="right">{productOfOrder.amount}</TableCell>
                                <TableCell align="right">{productOfOrder.product.price}</TableCell>
                                <TableCell align="right">{productOfOrder.amount * productOfOrder.product.price}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}