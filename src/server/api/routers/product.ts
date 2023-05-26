import { Product } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  getAllWithFilter: publicProcedure
    .input(z.object({
      categoryId: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      queryName: z.string().optional(),
      page: z.number(),
      size: z.number(),
      isNewFilterRequest: z.boolean().default(false)
    }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { categoryId, minPrice, maxPrice, queryName, page, size, isNewFilterRequest: isFirstRequset } = input;

      let query: string | undefined = undefined;
      if (queryName) query = queryName.split(' ').filter(item => item !== "").join(' & ');

      const whereOptions = {
        productName: queryName ? { search: query } : undefined,
        price: {
          gte: minPrice ? minPrice : undefined,
          lte: maxPrice ? maxPrice : undefined,
        },
        categoryId: categoryId ? categoryId : undefined
      }

      const [count, data] = await Promise.all([
        (isFirstRequset ? prisma.product.count({ where: whereOptions }) : undefined),
        prisma.product.findMany({ where: whereOptions, skip: (page - 1) * size, take: size })
      ])
      return { count: count, productData: data }
    }),
  getById: publicProcedure
    .input(z.object({
      id: z.string().uuid()
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findFirst({
        where: {
          productId: input.id
        }
      })
    }),

  getByCategory: publicProcedure
    .input(z.object({
      categoryId: z.string().uuid()
    }))
    .query(({ ctx, input }) => {

      return ctx.prisma.product.findMany({
        where: {
          categoryId: input.categoryId
        }
      })
    }),

  create: publicProcedure
    .input(z.object({
      productId: z.string().uuid(),
      categoryId: z.string().uuid(),
      vendorCode: z.string(),
      productName: z.string(),
      description: z.string(),
      weight: z.string(),
      size: z.string(),
      price: z.number(),
      productImg: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.create({
        data: {
          productId: input.productId,
          category: {
            connect: { categoryId: input.categoryId }
          },
          vendorCode: input.vendorCode,
          productName: input.productName,
          description: input.description,
          weight: input.weight,
          size: input.size,
          price: input.price,
          productImg: input.productImg
        }
      })
    })
});
