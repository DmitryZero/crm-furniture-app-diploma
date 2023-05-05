import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.category.findMany();
    }),

    getById: publicProcedure
        .input(z.object({
            id: z.string().uuid()
        }))
        .query(({ ctx, input }) => {
            return ctx.prisma.category.findFirst({
                where: {
                    categoryId: input.id
                }
            })
        }),

    create: publicProcedure
        .input(z.object({
            categoryId: z.string().uuid(),
            categoryName: z.string(),
            parentCategoryId: z.string().uuid().nullable()
        }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.category.create({
                data: {
                    categoryId: input.categoryId,
                    categoryName: input.categoryName,
                    parentCategory: {
                        connect: input.parentCategoryId ? { categoryId: input.parentCategoryId } : undefined
                    }
                }
            })
        }),

    getChildrenCategories: publicProcedure
        .input(z.object({
            parentId: z.string()
        }))
        .query(({ ctx, input }) => {            
            return ctx.prisma.category.findMany({
                where: {
                    parentCategoryId: input.parentId
                }
            })
        })    
});
