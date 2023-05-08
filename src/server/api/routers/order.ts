import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { Product, ProductsInCart } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env.mjs";

type ElmaOrder = {
    __id: string,
    client: [string],
    order: {
        rows: [
            {
                product: [string]
                amount: number
            }
        ]
    }
}


export const orderRouter = createTRPCRouter({
    createOrder: protectedProcedure
        .input(z.object({
            cartProducts: z.object({
                productId: z.string().uuid(),
                amount: z.number(),
            }).array(),
            summ: z.number()
        }))
        .mutation(async ({ input, ctx }) => {
            const { prisma, client } = ctx;

            return await prisma.order.create({
                data: {
                    summ: input.summ,
                    client: {
                        connect: {
                            clientId: client.clientId,
                        }
                    },
                    productsOfOrder: {
                        createMany: {
                            data: input.cartProducts
                        }
                    }
                }
            })
        }),
    createOrderInElma: protectedProcedure
        .input(z.object({
            context: z.object({
                __id: z.string().uuid(),
                client: z.string().uuid().array(),
                order: z.object({
                    rows: z.object({
                        product: z.string().uuid().array(),
                        amount: z.number()
                    }).array()
                })
            })
        }))
        .mutation(async ({ input }) => {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${env.ELMA_TOKEN}`);
            
            const raw = JSON.stringify(input);

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw
            };

            const response = await fetch("https://5b4p6ukak4ube.elma365.ru/pub/v1/app/_clients/_leads/create", requestOptions);
            if (response.ok) {
                const json = await response.json();
                return json;
            }
            const text = await response.text();
            return text;
        }),
});

