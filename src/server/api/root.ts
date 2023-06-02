import { productRouter } from "./routers/product";
import { categoryRouter } from "./routers/category";
import { clientRouter } from "./routers/client";
import { orderRouter } from "./routers/order";
import { createTRPCRouter } from "./trpc";
import { dadataRouter } from "./routers/dadata";
import { companyRouter } from "./routers/company";
import { cartRouter } from "./routers/cart";
import { elmaRouter } from "./routers/elma";
import { s3router } from "./routers/s3";
import { yokassaRouter } from "./routers/yookassa";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  client: clientRouter,
  order: orderRouter,
  dadata: dadataRouter,
  company: companyRouter,
  cart: cartRouter,
  elma: elmaRouter,
  s3: s3router,
  yokassa: yokassaRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
