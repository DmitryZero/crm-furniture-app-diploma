import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { Product, ProductsInCart } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env.mjs";
import { elmaRouter } from "./elma";

export const orderRouter = createTRPCRouter({
    createOrder: protectedProcedure
        .input(z.object({
            cartProducts: z.object({
                productId: z.string().uuid(),
                amount: z.number(),
            }).array(),
            summ: z.number(),
            companyId: z.string().nullish(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { prisma, client } = ctx;

            const order = await prisma.order.create({
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
                    },                    
                }
            })

            const companyId = input.companyId;
            const companyTemplate = {
                companyId: "",
                inn: "",
                address: "",
                companyName: ""
            }
            if (companyId && companyId !== "") {
                const company = await prisma.company.findFirst({
                    where: {
                        companyId: companyId
                    }
                })

                if (company) {
                    companyTemplate.companyId = companyId;
                    companyTemplate.address = company.address;
                    companyTemplate.companyName = company.companyName;
                    companyTemplate.inn = company.inn;
                }                
            } 
            
            const caller = elmaRouter.createCaller(ctx);
            await caller.createOrderInElma({
                orderId: order.orderId,
                company: (companyId && companyId !== "" && companyTemplate.inn !== "") ? companyTemplate : null,
                client: {
                    clientId: client.clientId,
                    email: client.email,
                    fullName: client.fullName,
                    phone: client.phone || ""
                },
                orderTable: {
                    rows: input.cartProducts
                }
            })
        }),
    getAllOdersByClient: protectedProcedure
    .query(async ({ctx}) => {
        const {prisma, client} = ctx;

        return await prisma.order.findMany({
            where: {
                clientId: client.clientId
            },
            include: {
                productsOfOrder: {
                    include: {
                        product: true
                    }
                }
            }
        })        
    })
});

