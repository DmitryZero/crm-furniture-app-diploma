import { z } from "zod";
import { CompanySuggestionType } from "~/components/dadata/CompanySuggestionType";
import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const companyRouter = createTRPCRouter({
    getAllByClient: protectedProcedure
        .query(async ({ ctx }) => {
            const { prisma, client } = ctx;

            return await prisma.company.findMany({
                where: {
                    clientInCompany: {
                        some: {
                            clientId: client.clientId
                        }
                    }
                }
            })
        }),
    addCompanyToClient: protectedProcedure
        .input(z.object({
            companyName: z.string(),
            inn: z.string().length(10),
            address: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const { prisma, client } = ctx;

            if (client.clientId) {
                await prisma.clientInCompany.create({
                    data: {
                        client: {
                            connect: {
                                clientId: client.clientId,
                            }
                        },
                        company: {
                            connectOrCreate: {
                                where: {
                                    inn: input.inn
                                },
                                create: {
                                    address: input.address,
                                    companyName: input.companyName,
                                    inn: input.inn,
                                }
                            }
                        },
                    }
                })
            }
        }),
    removeCompanyFromClient: protectedProcedure
        .input(z.object({ inn: z.string().length(10) }))
        .mutation(async ({ input, ctx }) => {
            const { prisma, client } = ctx;

            await prisma.clientInCompany.deleteMany({
                where: {
                    clientId: client.clientId,
                    company: {
                        inn: input.inn
                    }
                }
            })

        })
});
