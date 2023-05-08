import { productRouter } from "./routers/product";
import { categoryRouter } from "./routers/category";
import { clientRouter } from "./routers/client";
import { productsInCartRouter } from "./routers/productsInCart";
import { orderRouter } from "./routers/order";
import { createTRPCRouter } from "./trpc";
import { dadataRouter } from "./routers/dadata";
import { companyRouter } from "./routers/company";
import { cartRouter } from "./routers/cart";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  client: clientRouter,
  // productsInCart: productsInCartRouter,
  order: orderRouter,
  dadata: dadataRouter,
  company: companyRouter,
  cart: cartRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
