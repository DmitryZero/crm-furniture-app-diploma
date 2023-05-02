import type { NextPage } from "next";
import Head from "next/head";
import ProductCard from "~/components/products/ProductCard";
import ProductsFilterCard from "~/components/products/ProductsFilterCard";
import { api } from "~/utils/api";

const ProductSearchPage: NextPage = () => {
  const products = api.product.getAll.useQuery();

  return (
    <>
      <Head>
        <title>E-Shop</title>
        <meta name="description" content="CRM Furniture" />
      </Head>
      <main>
        <div className="px-12 py-6 grid grid-cols-12 gap-12">
          <div className="col-span-3">
            <ProductsFilterCard />
          </div>
          <div className="col-span-9 grid grid-cols-3 gap-5 auto-rows-fr">
            {products && products.data?.map(product => {
              return (
                <ProductCard key={product.productId} product={product} />
              )
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductSearchPage;
