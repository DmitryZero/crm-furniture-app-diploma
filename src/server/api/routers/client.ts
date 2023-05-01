import { z } from "zod";
import MD5 from "crypto-js/md5";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { api } from "~/utils/api";

export const clientRouter = createTRPCRouter({
  signIn: publicProcedure
    .input(z.object({
      login: z.string(),
      password: z.string()
    }))
    .query(({ input, ctx }) => {
      const password = MD5(input.password).toString();

      return ctx.prisma.client.findFirst({
        where: {
          login: input.login,
          password: password
        }
      })
    }),
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const caller = clientRouter.createCaller(ctx);
      const message: string = await caller.test();
      
      return message;
    }),
  test: publicProcedure
    .query(({ ctx }) => {
      return "test"
    }),
});
