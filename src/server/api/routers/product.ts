import { z } from "zod";
import { createTRPCRouter, elmaProcedure, publicProcedure } from "~/server/api/trpc";
import { s3router } from "./s3";
import { env } from "~/env.mjs";

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

  create: elmaProcedure
    .input(z.object({
      productId: z.string().uuid(),
      categoryId: z.string().uuid(),
      vendorCode: z.string(),
      productName: z.string(),
      description: z.string(),
      weight: z.string(),
      size: z.string(),
      price: z.number(),
      productImg: z.string(),
      fileName: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const caller = s3router.createCaller(ctx);
      const res = await caller.createProductImgFromElma({
        fileName: input.fileName,
        body: input.productImg
      });

      if (res?.$metadata.httpStatusCode !== 200) return "S3 Error";

      return await ctx.prisma.product.upsert({
        where: {
          productId: input.productId
        },
        create: {
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
          productSrc: `${env.NEXT_PUBLIC_S3_URL}/${env.NEXT_PUBLIC_S3_BUCKET}/products/${input.fileName}.png`
        },
        update: {
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
          productSrc: `${env.NEXT_PUBLIC_S3_URL}/${env.NEXT_PUBLIC_S3_BUCKET}/products/${input.productId}.png`
        }
      })
    }),
});
