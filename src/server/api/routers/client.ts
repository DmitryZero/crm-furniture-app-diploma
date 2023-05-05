import { z } from "zod";
import MD5 from "crypto-js/md5";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { api } from "~/utils/api";
import UserController from "~/auth/UserController";

export const clientRouter = createTRPCRouter({
  signIn: publicProcedure
    .input(z.object({
      login: z.string(),
      password: z.string()
    }))
    .query(({ input, ctx }) => {
      const password = MD5(input.password).toString();

      
    }),
  signUp: publicProcedure
    .input(z.object({
      email: z.string(),
      fullName: z.string(),
      password: z.string()
    }))
    .query(async ({ input, ctx }) => {
      return await UserController.signUp({email: input.email, fullName: input.fullName, password: input.password});
    }),
  login: protectedProcedure
    .input(z.object({
      login: z.string(),
      password: z.string()
    }))
    .query(({ input, ctx }) => {

      return true;
    })
});
