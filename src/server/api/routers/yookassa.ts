import { ICreatePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { z } from 'zod';
import { env } from '~/env.mjs';
import client from '~/s3/s3Client';

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const yokassaRouter = createTRPCRouter({
    createPayment: protectedProcedure
        .input(z.object({
            summ: z.number()
        }))
        .mutation(async ({ input }) => {
            const checkout = new YooCheckout({ shopId: env.YOOKASSA_SHOP_ID, secretKey: env.YOOKASSA_SECRET_KEY });
            const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';

            const createPayload: ICreatePayment = {
                amount: {
                    value: input.summ.toString(),
                    currency: 'RUB'
                },
                payment_method_data: {
                    type: 'bank_card'
                },
                confirmation: {
                    type: 'redirect',
                    return_url: 'test'
                },
                capture: true
            };

            try {
                const payment = await checkout.createPayment(createPayload, idempotenceKey);
                console.log(payment)
            } catch (error) {
                console.error(error);
            }
        })
});
