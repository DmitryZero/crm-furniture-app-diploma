import { productRouter } from "./routers/product";
import { categoryRouter } from "./routers/category";
import { clientRouter } from "./routers/client";
import { productsInCartRouter } from "./routers/productsInCart";
import { orderRouter } from "./routers/order";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  client: clientRouter,
  productsInCart: productsInCartRouter,
  order: orderRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
