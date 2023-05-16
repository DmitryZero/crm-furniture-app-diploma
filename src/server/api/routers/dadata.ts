import { z } from "zod";
import { env } from "~/env.mjs";
import { CompanySuggestionTypeSchema } from "~/schemas/CompanyDaDataType";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const dadataRouter = createTRPCRouter({
    findCompaniesByInfo: protectedProcedure
        .input(z.object({
            query: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
            const token = env.DADATA_API_KEY;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + token
                },
                body: JSON.stringify({ query: input.query, status: ["ACTIVE"], branch_type: "MAIN" })
            });
            if (response.ok) {
                const parsedData = CompanySuggestionTypeSchema.parse(await response.json());
                return parsedData;
            }

            return null;
        }),
});
