import { Pagination } from "@mui/material";
import { Product } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import ProductCard from "~/components/products/ProductCard";
import ProductCardSkeleton from "~/components/products/ProductCardSkeleton";
import ProductsFilterCard from "~/components/products/ProductsFilterCard";
import { api } from "~/utils/api";

interface ProductFilter {
  minPrice?: number,
  maxPrice?: number,
  query?: string,
  categoryId?: string
}

interface IProductsPage {
  products: Product[],
  currentIndex: number,
  size: number
}

const ProductSearchPage: NextPage = () => {
  const [productsData, setProductsData] = useState<IProductsPage>({ products: [], currentIndex: 0, size: 2 });
  const [productFilter, setProductFilter] = useState<ProductFilter>({});

  // const { isFetching } = api.product.getAll.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   onSuccess(data) {
  //     if (data) setProductsData(prevValue => ({ ...prevValue, products: data }));
  //   },
  // });

  const { isFetching, refetch } = api.product.getAllWithFilter.useQuery({
    categoryId: productFilter.categoryId,
    minPrice: productFilter.minPrice,
    maxPrice: productFilter.maxPrice,
    queryName: productFilter.query,
    from: productsData.currentIndex,
    size: productsData.size
  }, {
    enabled: false
  });

  useEffect(() => {
    debouncedSearch()
  }, [productFilter])

  const debouncedSearch = useDebouncedCallback(
    async () => {
      const { data } = await refetch();
      if (data) setProductsData(prevValue => ({ ...prevValue, products: data }));
    },
    300
  );

  // useEffect(() => {
  //   debounceFilter.cancel();
  // }, [debounceFilter])

  return (
    <>
      <Head>
        <title>E-Shop</title>
        <meta name="description" content="CRM Furniture" />
      </Head>
      <main>
        <div className="px-12 py-6 grid grid-cols-12 gap-12 items-start">
          <div className="col-span-3">
            <ProductsFilterCard setProductFilter={setProductFilter} categoryId={productFilter.categoryId} />
          </div>
          <div className="col-span-9 grid grid-cols-3 gap-5 auto-rows-fr items-stretch">
            {
              isFetching
                ? Array.from(Array(10), (item, index) => { return (<ProductCardSkeleton key={index} />) })
                : productsData.products.map(product => {
                  return (
                    <ProductCard key={product.productId} product={product} />
                  )
                })
            }
            {
              // productsApi.data && productsApi.data.length === 0 && <div className="text-2xl">Нет подходящих элементов</div>
            }

          </div>
        </div>
        <Pagination className="flex justify-center" count={10} color="primary" />
      </main>
    </>
  );
};

export default ProductSearchPage;
