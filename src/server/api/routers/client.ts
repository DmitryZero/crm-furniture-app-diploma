import { z } from "zod";
import { setCookie, deleteCookie } from 'cookies-next';

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import UserController from "~/auth/UserController";

export const clientRouter = createTRPCRouter({
  signIn: publicProcedure
    .input(z.object({
      email: z.string(),
      password: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { req, res } = ctx;
      const session = await UserController.signIn({ email: input.email, password: input.password });

      const currentDate = new Date();
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDay());
      setCookie('token', session.token, { req, res, expires: nextMonth, httpOnly: true });

      return session.client;
    }),
  signUp: publicProcedure
    .input(z.object({
      email: z.string().email(),
      fullName: z.string().min(1),
      password: z.string().min(1)
    }))
    .mutation(async ({ input, ctx }) => {
      const { req, res } = ctx;
      const session = await UserController.signUp({ email: input.email, fullName: input.fullName, password: input.password });

      const currentDate = new Date();
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDay());
      setCookie('token', session.token, { req, res, expires: nextMonth, httpOnly: true });

      return session.client;
    }),
  clearTokenCookie: protectedProcedure
    .mutation(({ ctx }) => {
      const { req, res } = ctx;
      deleteCookie('token', { req, res })

      return true;
    }),
  getClientByCookie: protectedProcedure
    .query(({ ctx }) => {
      const { client } = ctx;

      return client;
    }),
  updateUserInfo: protectedProcedure
    .input(z.object({
      fullName: z.string(),
      email: z.string().email(),
      phone: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { prisma, client } = ctx;

      const user = await prisma.client.update({
        where: {
          clientId: client.clientId
        },
        data: {
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
        }
      })

      return user;
    }),
  getInfoAboutClient: protectedProcedure
    .query(({ ctx }) => {
      return ctx.client;
    }),
  getClientCompany: protectedProcedure
    .query(async ({ ctx }) => {
      const { prisma, client } = ctx;

      return await prisma.client.findFirst({
        where: {
          clientId: client.clientId
        },
        include: {
          company: true
        }
      })
    }),
  removeCompanyFromClient: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { prisma, client } = ctx;

      await prisma.client.update({
        where: {
          clientId: client.clientId
        },
        data: {
          company: {
            disconnect: true
          }
        }
      })
    })
});
