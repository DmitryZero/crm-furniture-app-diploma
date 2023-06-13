import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const companyRouter = createTRPCRouter({
    getAllByClient: protectedProcedure
        .query(async ({ ctx }) => {
            const { prisma, client } = ctx;

            return await prisma.company.findMany({
                where: {
                    clients: {
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

            await prisma.company.upsert({
                where: {
                    inn: input.inn
                },
                update: {
                    clients: {
                        connect: {
                            clientId: client.clientId
                        }
                    }
                },
                create: {
                    address: input.address,
                    companyName: input.companyName,
                    inn: input.inn,
                    clients: {
                        connect: {
                            clientId: client.clientId
                        }
                    }
                }
            })
        }),
    // removeCompanyFromClient: protectedProcedure
    //     .input(z.object({ inn: z.string().length(10) }))
    //     .mutation(async ({ input, ctx }) => {
    //         const { prisma, client } = ctx;

    //         await prisma.company.update({
    //             where: {
    //                 inn: input.inn
    //             },
    //             data: {
    //                 clients: {
    //                     disconnect: {
    //                         clientId: client.clientId
    //                     }
    //                 }
    //             }
    //         })

    //     })
});
