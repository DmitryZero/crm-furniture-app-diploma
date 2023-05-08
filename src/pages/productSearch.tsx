import { Product } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import ProductCard from "~/components/products/ProductCard";
import ProductsFilterCard from "~/components/products/ProductsFilterCard";
import { api } from "~/utils/api";

const ProductSearchPage: NextPage = () => {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const productsApi = api.product.getAll.useQuery(undefined, {enabled: false});  

  useEffect(() => {
    const fetchData = async () => {
      const productsRes = await productsApi.refetch();
      if (productsRes.data) setProducts(productsRes.data);
    }

    fetchData()
      .catch(console.error);
  }, [])

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
            {products && products?.map(product => {
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
