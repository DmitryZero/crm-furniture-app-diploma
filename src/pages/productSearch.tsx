import { Product } from "@prisma/client";
import debounce from "lodash.debounce";
import type { NextPage } from "next";
import Head from "next/head";
import { Suspense, useCallback, useEffect, useState } from "react";
import ProductCard from "~/components/products/ProductCard";
import ProductSkeleton from "~/components/products/ProductSkeleton";
import ProductsFilterCard from "~/components/products/ProductsFilterCard";
import { api } from "~/utils/api";
import handleErrors from "~/utils/handleErrors";

const ProductSearchPage: NextPage = () => {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [query, setQuery] = useState<string>('');

  const productsApi = api.product.getAllWithFilter.useQuery({
    categoryId: categoryId,
    minPrice: minPrice,
    maxPrice: maxPrice,
    queryName: query
  }, { enabled: false });

  useEffect(() => {
    debounceFn();
  }, [categoryId, minPrice, maxPrice, query])

  const getFilteredProducts = handleErrors(async () => {
    const productsRes = await productsApi.refetch();
    if (productsRes.data) setProducts(productsRes.data);
  })
  const debounceFn = useCallback(debounce(getFilteredProducts, 500), []);

  return (
    <>
      <Head>
        <title>E-Shop</title>
        <meta name="description" content="CRM Furniture" />
      </Head>
      <main>
        <div className="px-12 py-6 grid grid-cols-12 gap-12">
          <div className="col-span-3">
            <ProductsFilterCard setQuery={setQuery} setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} categoryId={categoryId} setCategoryId={setCategoryId} />
          </div>
          <div className="col-span-9 grid grid-cols-3 gap-5 auto-rows-fr items-stretch">
            {
              productsApi.isFetching
                ? Array.from(Array(10), (item, index) => { return (<ProductSkeleton key={index} />) })
                : products !== undefined && products.length > 0 &&
                products.map(product => {
                  return (
                    <ProductCard key={product.productId} product={product} />
                  )
                })
            }
            {
              productsApi.data && productsApi.data.length === 0 && <div className="text-2xl">Нет подходящих элементов</div>
            }
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductSearchPage;
