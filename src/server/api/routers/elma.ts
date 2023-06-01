import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { env } from "~/env.mjs";

export const elmaRouter = createTRPCRouter({
    createOrderInElma: protectedProcedure
        .input(z.object({
            "orderId": z.string().uuid(),
            "client": z.object({
                "clientId": z.string().uuid(),
                "fullName": z.string(),
                "phone": z.string(),
                "email": z.string().email()
            }),
            "company": z.object({
                "companyId": z.string().uuid(),
                "inn": z.string(),
                "address": z.string(),
                "companyName": z.string()
            }).nullable(),
            "orderTable": z.object({
                "rows": z.object({
                    "productId": z.string().uuid(),
                    "amount": z.number()
                }).array()
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

            return await fetch("https://5b4p6ukak4ube.elma365.ru/api/extensions/24ea2b1c-9a27-4dc8-bbca-e6410ee79891/script/CreateOrder", requestOptions);
        }),
});

