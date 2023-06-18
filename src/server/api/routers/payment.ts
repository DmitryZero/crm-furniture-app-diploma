import { type ICreatePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { OrderType, PaymentStatus, PersonalOrderStatus, RegularOrderStatus } from '@prisma/client';
import { z } from 'zod';
import { env } from '~/env.mjs';
import checkYookassaCheck from '~/schemas/yookassaCheckSchema';

import { createTRPCRouter, elmaProcedure, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { elmaRouter } from './elma';

export const paymentRouter = createTRPCRouter({
    createPaymentFromElma: elmaProcedure
        .input(z.object({
            summ: z.number(),
            orderId: z.string(),
            type: z.enum(["prepayment", "postpayment"]),
            callbackUrl: z.string().url()
        }))
        .mutation(async ({ input, ctx }) => {
            console.log("createPaymentFromElma")
            const payment = await ctx.prisma.payment.create({
                data: {
                    amount: input.summ,
                    Order: {
                        connect: {
                            orderId: input.orderId
                        }
                    },
                    paymentType: input.type,
                    callbackUrl: input.callbackUrl
                }
            })
            return payment;
        }),
    createPaymentInYookassa: protectedProcedure
        .input(z.object({
            summ: z.number(),
            orderId: z.string(),
            type: z.enum(["prepayment", "postpayment"])
        }))
        .mutation(async ({ input, ctx }) => {
            console.log("createPaymentInYookassa")
            const checkout = new YooCheckout({ shopId: env.YOOKASSA_SHOP_ID, secretKey: env.YOOKASSA_SECRET_KEY });
            const idempotenceKey = input.orderId + "__" + input.type;

            const createPayload: ICreatePayment = {
                amount: {
                    value: input.summ.toString(),
                    currency: 'RUB'
                },
                payment_method_data: {
                    type: 'yoo_money'
                },
                confirmation: {
                    type: 'redirect',
                    return_url: 'http://92.51.39.189:3000/userProfile'
                },
                capture: true
            };

            try {
                const payment = await checkout.createPayment(createPayload, idempotenceKey);
                console.log("Server payment", input);

                const paymentFromDB = await ctx.prisma.payment.findFirst({
                    where: {
                        orderId: input.orderId,
                        paymentType: input.type
                    }
                })
                if (!paymentFromDB) throw new Error("paymentFromDB is null");

                await ctx.prisma.payment.update({
                    where: {
                        paymentId: paymentFromDB.paymentId
                    },
                    data: {
                        yookassaId: payment.id
                    }
                })

                return payment;
            } catch (error) {
                console.error(error);
            }
        }),
    payCheck: publicProcedure
        .mutation(async ({ ctx }) => {
            console.log("payCheck")
            if (checkYookassaCheck(ctx.req.body)) {
                console.log("checkPay start", ctx.req.body)
                const input = ctx.req.body;

                const paymentFromDB = await ctx.prisma.payment.findFirst({
                    where: {
                        yookassaId: input.object.id
                    }
                })

                const payment = await ctx.prisma.payment.update({
                    where: {
                        paymentId: paymentFromDB?.paymentId
                    },
                    data: {
                        paymentStatus: PaymentStatus.succeeded,
                    }
                })

                const raw = JSON.stringify({
                    "orderId": payment.orderId,
                    "summ": payment.amount,
                    "type": payment.paymentType,
                    "paymentId": payment.paymentId
                });

                const requestOptions = {
                    method: 'POST',
                    body: raw,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${env.ELMA_TOKEN}`
                    }
                };

                const response = await fetch(payment.callbackUrl, requestOptions);
                // const result = await response.json();
                // console.log("response", response);
                // console.log("result", result);
            } else {
                console.log("failed", ctx.req.body);
                return "yookassaCheckschema parse failed";
            }
        })
});



// const order = payment.Order;
// if (!order || !order.orderId) throw new Error('checkPay - Order is null');

// const { orderType } = order;
// const newStatusRegular = orderType === OrderType.regularOrder
//     ? (
//         payment.paymentType === "prepayment"
//             ? RegularOrderStatus.delivery
//             : RegularOrderStatus.success
//     )
//     : null;
// const newStatusPersonal = orderType === OrderType.personalOrder
//     ? (
//         payment.paymentType === "prepayment"
//             ? PersonalOrderStatus.manufacturing
//             : PersonalOrderStatus.success
//     )
//     : null;

// await ctx.prisma.order.update({
//     where: {
//         orderId: order.orderId
//     },
//     data: {
//         personalOrderStatus: newStatusPersonal,
//         regularOrderStatus: newStatusRegular
//     }
// })

// const caller = elmaRouter.createCaller(ctx);
// await caller.createPaymentInElma({
//     orderId: order.orderId,
//     summ: payment.amount,
//     yookassaId: payment.paymentId,
//     type: payment.paymentType
// })