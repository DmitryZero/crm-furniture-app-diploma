import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCClientError } from "@trpc/client";

export const productsInCartRouter = createTRPCRouter({
    updateCart: publicProcedure
        .input(z.object({
            clientId: z.string().uuid(),
            productId: z.string().uuid(),
            amount: z.number().nonnegative()
        }))
        .mutation(async ({ input, ctx }) => {
            if (input.amount > 0) {
                return await ctx.prisma.productsInCart.upsert({
                    where: {
                        clientId_productId: {
                            clientId: input.clientId,
                            productId: input.productId
                        }
                    },
                    update: {
                        amount: input.amount
                    },
                    create: {
                        client: {
                            connect: { clientId: input.clientId }
                        },
                        product: {
                            connect: { productId: input.productId }
                        },
                        amount: input.amount
                    }
                })
            } else {
                return await ctx.prisma.productsInCart.delete({
                    where: {
                        clientId_productId: {
                            clientId: input.clientId,
                            productId: input.productId
                        }
                    }
                })
            }
        }),
    getAmountOfProductsByClient: publicProcedure
        .input(z.object({
            clientId: z.string().uuid(),
            productId: z.string().uuid()
        }))
        .query(async ({ input, ctx }) => {
            const item = await ctx.prisma.productsInCart.findFirst({
                where: {
                    clientId: input.clientId,
                    productId: input.productId
                }
            });

            return item?.amount || 0;
        }),
    getProductsInCartByClient: publicProcedure
        .input(z.object({
            clientId: z.string().uuid()
        }))
        .query(async ({ input, ctx }) => {
            const cartedItems = await ctx.prisma.productsInCart.findMany({
                where: {
                    clientId: input.clientId
                }
            });

            const ids = cartedItems.map(item => item.productId);

            return await ctx.prisma.product.findMany({
                where: {
                    productId: { in: ids }
                }
            })
        }),
    getTotalSummCart: publicProcedure
        .input(z.object({
            clientId: z.string().uuid()
        }))
        .query(async ({ input, ctx }) => {
            const productsInCart = await ctx.prisma.productsInCart.findMany({
                where: {
                    clientId: input.clientId
                }
            })

            if (!productsInCart) throw new TRPCClientError("productsInCart");

            const findProducts = [];
            for (let i = 0; i < productsInCart.length; i++) {
                findProducts.push({
                    productId: productsInCart[i]?.productId
                })
            }

            const products = await ctx.prisma.product.findMany({
                where: {
                    OR: findProducts
                }
            })

            if (products.length != productsInCart.length) throw new TRPCClientError("productsInCart");

            let summ = 0;
            products.every((product, index) => summ += product.price * (productsInCart[index]?.amount || 0));

            return summ;
        }),
    getTotalAmountsOfProductsByClient: publicProcedure
        .input(z.object({
            clientId: z.string().uuid()
        }))
        .query(async ({ input, ctx }) => {
            const items = await ctx.prisma.productsInCart.findMany({
                where: {
                    clientId: input.clientId
                }
            });

            const amount = items && items.length > 0 ? items.reduce((summ, current) => summ += current.amount, 0) : 0;
            return amount;
        })
});
