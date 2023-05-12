import { z } from "zod";
import { CompanySuggestionType } from "~/components/dadata/CompanySuggestionType";
import { env } from "~/env.mjs";
import { CompanySuggestionTypeSchema } from "~/schemas/CompanyDaDataType";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const cartRouter = createTRPCRouter({
    getCartsItems: protectedProcedure
        .query(async ({ ctx }) => {
            const { prisma, client } = ctx;

            return await prisma.productsInCart.findMany({
                where: {
                    clientId: client.clientId
                },
                include: {
                    product: true
                }
            })
        }),
    getAmountOfProductsByClient: protectedProcedure
        .input(z.object({
            productId: z.string().uuid()
        }))
        .query(async ({ input, ctx }) => {
            const { prisma, client } = ctx;

            const item = await prisma.productsInCart.findFirst({
                where: {
                    clientId: client.clientId,
                    productId: input.productId
                }
            });

            return item?.amount || 0;
        }),
    updateCart: protectedProcedure
        .input(z.object({
            productId: z.string().uuid(),
            amount: z.number().nonnegative()
        }))
        .mutation(async ({ input, ctx }) => {
            const { prisma, client } = ctx;

            if (input.amount > 0) {
                return await ctx.prisma.productsInCart.upsert({
                    where: {
                        clientId_productId: {
                            clientId: client.clientId,
                            productId: input.productId
                        }
                    },
                    update: {
                        amount: input.amount
                    },
                    create: {
                        client: {
                            connect: { clientId: client.clientId }
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
                            clientId: client.clientId,
                            productId: input.productId
                        }
                    }
                })
            }
        }),
    clearCart: protectedProcedure
        .mutation(async ({ ctx }) => {
            const { prisma, client } = ctx;

            return await prisma.productsInCart.deleteMany({
                where: {
                    clientId: client.clientId
                }
            }) 
        }),
});
