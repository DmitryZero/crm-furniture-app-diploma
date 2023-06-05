import { createTRPCRouter, elmaProcedure, protectedProcedure } from "~/server/api/trpc";
import { OrderType, PersonalOrderStatus, RegularOrderStatus } from "@prisma/client";
import { z } from "zod";
import { elmaRouter } from "./elma";
import { cartRouter } from "./cart";
import { s3router } from "./s3";
import { Company, DocumentType } from "@prisma/client";
import { env } from "~/env.mjs";

export const orderRouter = createTRPCRouter({
    createRegularOrder: protectedProcedure
        .input(z.object({
            cartProducts: z.object({
                productId: z.string().uuid(),
                amount: z.number(),
            }).array(),
            summ: z.number(),
            company: z.custom<Company | null>()
        }))
        .mutation(async ({ input, ctx }) => {
            const { prisma, client } = ctx;

            const order = await prisma.order.create({
                data: {
                    totalSumm: input.summ,
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
                    regularOrderStatus: RegularOrderStatus.new,
                    orderType: OrderType.regularOrder,
                }
            })

            const companyTemplate = input.company ? {
                companyId: input.company.companyId,
                inn: input.company.inn,
                address: input.company.address,
                companyName: input.company.companyName
            } : undefined;

            const caller = elmaRouter.createCaller(ctx);
            await caller.createRegularOrderInElma({
                orderId: order.orderId,
                company: companyTemplate ? companyTemplate : null,
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

            const cartCaller = cartRouter.createCaller(ctx);
            await cartCaller.clearCart(undefined);
        }),
    createPersonalOrder: protectedProcedure
        .input(z.object({
            files: z.object({
                name: z.string(),
                body: z.any().nullish()
            }).array(),
            comment: z.string(),
            company: z.custom<Company | null>(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { prisma, client } = ctx;

            console.log("Input", input.files);

            const order = await prisma.order.create({
                data: {
                    client: {
                        connect: {
                            clientId: client.clientId,
                        }
                    },
                    personalOrderStatus: PersonalOrderStatus.new,
                    orderType: OrderType.personalOrder,
                    comment: input.comment
                }
            })

            const companyTemplate = input.company ? {
                companyId: input.company.companyId,
                inn: input.company.inn,
                address: input.company.address,
                companyName: input.company.companyName
            } : undefined;

            const s3Caller = s3router.createCaller(ctx);
            const result = await s3Caller.createFiles({
                files: input.files,
                orderId: order.orderId
            });

            if (result?.some(item => item?.$metadata.httpStatusCode !== 200)) throw new Error("S3 Error");

            const elmaFiles = input.files.map(item => {
                return {
                    fileName: item.name,
                    url: `${env.NEXT_PUBLIC_S3_URL}/${env.NEXT_PUBLIC_S3_BUCKET}/orderFiles/${order.orderId}/${item.name}`
                }
            })

            await ctx.prisma.document.createMany({
                data: elmaFiles.map(item => {
                    return {
                        documentName: item.fileName,
                        documentSrc: item.url,
                        orderId: order.orderId,
                        documentType: DocumentType.clientDocument
                    }
                })
            })

            const caller = elmaRouter.createCaller(ctx);
            await caller.createPersonalOrderInElma({
                orderId: order.orderId,
                company: companyTemplate ? companyTemplate : null,
                client: {
                    clientId: client.clientId,
                    email: client.email,
                    fullName: client.fullName,
                    phone: client.phone || ""
                },
                files: elmaFiles,
                comment: input.comment
            })
        }),
    getAllOdersByClient: protectedProcedure
        .query(async ({ ctx }) => {
            const { prisma, client } = ctx;

            const orders = await prisma.order.findMany({
                where: {
                    clientId: client.clientId
                },
                include: {
                    productsOfOrder: {
                        include: {
                            product: true
                        }
                    },
                    clientDocuments: true                 
                }
            })

            return orders.reverse();
        }),
    updateRegularOrderStatus: elmaProcedure
        .input(z.object({
            id: z.string().uuid(),
            newStatus: z.nativeEnum(RegularOrderStatus)
        }))
        .mutation(async ({ input, ctx }) => {
            const { prisma } = ctx;

            return await prisma.order.update({
                where: {
                    orderId: input.id
                },
                data: {
                    regularOrderStatus: input.newStatus
                }
            })
        }),
    updatePersonalOrderStatus: elmaProcedure
        .input(z.object({
            id: z.string().uuid(),
            newStatus: z.nativeEnum(PersonalOrderStatus)
        }))
        .mutation(async ({ input, ctx }) => {
            const { prisma } = ctx;

            return await prisma.order.update({
                where: {
                    orderId: input.id
                },
                data: {
                    personalOrderStatus: input.newStatus
                }
            })
        }),
    updateOrderData: elmaProcedure
        .input(z.object({
            id: z.string().uuid(),
            regularOrderStatus: z.nativeEnum(RegularOrderStatus).nullish(),
            personalOrderStatus: z.nativeEnum(PersonalOrderStatus).nullish(),
            prepayment: z.number().nullish(),
            postpayment: z.number().nullish()
        }))
        .mutation(async ({ input, ctx }) => {
            const { prisma } = ctx;

            const personalOrderStatus = input.personalOrderStatus ? input.personalOrderStatus : undefined;
            const regularOrderStatus = input.regularOrderStatus ? input.regularOrderStatus : undefined;
            const prepaymentSumm = input.prepayment ? input.prepayment : undefined;
            const postpaymentSumm = input.postpayment ? input.postpayment : undefined;

            return await prisma.order.update({
                where: {
                    orderId: input.id
                },
                data: {
                    personalOrderStatus,
                    regularOrderStatus,
                    prepaymentSumm,
                    postpaymentSumm,
                }
            })
        })
});

