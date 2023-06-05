import { ICreatePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { OrderType, PaymentStatus, PersonalOrderStatus, RegularOrderStatus } from '@prisma/client';
import { z } from 'zod';
import { env } from '~/env.mjs';
import client from '~/s3/s3Client';
import checkYookassaCheck from '~/schemas/yookassaCheckSchema';

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { elmaRouter } from './elma';

export const yookassaRouter = createTRPCRouter({
    createPayment: protectedProcedure
        .input(z.object({
            summ: z.number(),
            orderId: z.string(),
            type: z.enum(["prepayment", "postpayment"])
        }))
        .mutation(async ({ input, ctx }) => {
            const checkout = new YooCheckout({ shopId: env.YOOKASSA_SHOP_ID, secretKey: env.YOOKASSA_SECRET_KEY });
            const idempotenceKey = input.orderId + "-" + input.type;

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
                    return_url: 'http://localhost:3000/userCartAndOrders'
                },
                capture: true
            };

            try {
                const payment = await checkout.createPayment(createPayload, idempotenceKey);
                console.log("Server payment", input);

                await ctx.prisma.payment.upsert({
                    where: {
                        paymentId: payment.id
                    },
                    create: {
                        paymentId: payment.id,
                        amount: input.summ,
                        paymentType: input.type,
                        Order: {
                            connect: {
                                orderId: input.orderId
                            }
                        }
                    },
                    update: {
                        amount: input.summ,
                        Order: {
                            connect: {
                                orderId: input.orderId
                            }
                        }
                    }
                })

                return payment;
            } catch (error) {
                console.error(error);
            }
        }),
    checkPay: publicProcedure
        .mutation(async ({ ctx }) => {
            if (checkYookassaCheck(ctx.req.body)) {
                console.log("checkPay start", ctx.req.body)
                const input = ctx.req.body;

                const payment = await ctx.prisma.payment.update({
                    where: {
                        paymentId: input.object.id
                    },
                    data: {
                        paymentStatus: PaymentStatus.succeeded,
                    },
                    include: {
                        Order: true
                    }
                })

                const order = payment.Order;
                if (!order || !order.orderId) throw new Error('checkPay - Order is null');

                const { orderType } = order;
                const newStatusRegular = orderType === OrderType.regularOrder
                    ? (
                        payment.paymentType === "prepayment"
                            ? RegularOrderStatus.delivery
                            : RegularOrderStatus.success
                    )
                    : null;
                const newStatusPersonal = orderType === OrderType.personalOrder
                    ? (
                        payment.paymentType === "prepayment"
                            ? PersonalOrderStatus.manufacturing
                            : PersonalOrderStatus.success
                    )
                    : null;

                const orderPrisma = await ctx.prisma.order.update({
                    where: {
                        orderId: order.orderId
                    },
                    data: {
                        personalOrderStatus: newStatusPersonal,
                        regularOrderStatus: newStatusRegular
                    }
                })

                const caller = elmaRouter.createCaller(ctx);
                await caller.createPaymentInElma({
                    orderId: order.orderId,
                    summ: payment.amount,
                    yookassaId: payment.paymentId,
                    type: payment.paymentType
                })
            } else {
                console.log("failed", ctx.req.body);
                return "yookassaCheckschema parse failed";
            }
        })
});
