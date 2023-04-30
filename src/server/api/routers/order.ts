import { z } from "zod";
import MD5 from "crypto-js/md5";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { api } from "~/utils/api";
import { Client, Prisma, Product, ProductsInCart } from "@prisma/client";
import { TRPCClientError, loggerLink } from "@trpc/client";
import { log } from "console";

type OrderData = {
    productsInCart: ProductsInCart,
    product: Product,
}

type ProductInfo = {
    product: Product,
    amount: number
}

type OrderInfo = {
    products: ProductInfo[],
    totalSum: number
}


export const orderRouter = createTRPCRouter({
    // createOrder: publicProcedure
    //     .input(z.object({
    //         clientId: z.string().uuid()
    //     }))
    //     .mutation(async ({ input, ctx }) => {
    //         let orderData: OrderData[] = [];

    //         const productsInCart = await ctx.prisma.productsInCart.findMany({
    //             where: {
    //                 clientId: input.clientId
    //             }
    //         })

    //         if (!productsInCart) throw new TRPCClientError("productsInCart");

    //         const findProducts = [];
    //         for (let i = 0; i < productsInCart.length; i++) {
    //             findProducts.push({
    //                 productId: productsInCart[i]?.productId
    //             })
    //         }

    //         const products = await ctx.prisma.product.findMany({
    //             where: {
    //                 OR: findProducts
    //             }
    //         })

    //         if (products.length != productsInCart.length) throw new TRPCClientError("productsInCart");

    //         let summ = 0;
    //         products.every((product, index) => summ += product.price * (productsInCart[index]?.amount || 0));

    //         let orderedProducts: { amount: number, productId: string }[] = [];
    //         products.forEach((product, index) => {
    //             orderedProducts.push({
    //                 amount: productsInCart[index]?.amount || 0,
    //                 productId: product.productId
    //             })
    //         });

    //         const order = await ctx.prisma.order.create({
    //             data: {
    //                 summ: summ,
    //                 client: {
    //                     connect: { clientId: input.clientId }
    //                 },
    //                 productsOfOrder: {
    //                     createMany: {
    //                         data: orderedProducts
    //                     }
    //                 }
    //             }
    //         })

    //         await ctx.prisma.productsInCart.deleteMany({
    //             where: {
    //                 clientId: input.clientId
    //             }
    //         });

    //         return order;
    //     }),
    // getAll: publicProcedure
    //     .input(z.object({
    //         clientId: z.string().uuid()
    //     }))
    //     .query(async ({ input, ctx }) => {
    //         return await ctx.prisma.order.findMany({
    //             where: {
    //                 clientId: input.clientId
    //             }
    //         })
    //     }),

    // getOrderInfo: publicProcedure
    //     .input(z.object({
    //         orderId: z.string().uuid()
    //     }))
    //     .query(async ({ input, ctx }): Promise<OrderInfo> => {
    //         const productsOfOrder = await ctx.prisma.productsOfOrder.findMany({
    //             where: {
    //                 orderId: input.orderId
    //             }
    //         })

    //         if (!productsOfOrder) throw new TRPCClientError("getOrderInfo - order is not found");

    //         const findProducts = [];
    //         for (let i = 0; i < productsOfOrder.length; i++) {
    //             findProducts.push({
    //                 productId: productsOfOrder[i]?.productId
    //             })
    //         }

    //         const products = await ctx.prisma.product.findMany({
    //             where: {
    //                 OR: findProducts
    //             }
    //         })

    //         if (products.length != productsOfOrder.length) throw new TRPCClientError("productsInCart");


    //         const result: ProductInfo[] = [];
    //         let totalSum = 0;
            
    //         for (let i = 0; i < products.length; i++) {
    //             result.push({
    //                 product: products[i]!,
    //                 amount: productsOfOrder[i]?.amount!
    //             })

    //             totalSum += productsOfOrder[i]?.amount! * products[i]?.price!
    //         }

    //         return {
    //             products: result,
    //             totalSum: totalSum
    //         }
    //     })
});
