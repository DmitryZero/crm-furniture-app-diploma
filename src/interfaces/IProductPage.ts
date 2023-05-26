import { Product } from "@prisma/client";

export default interface IProductsPage {
    products: Product[],
    size: number
}