import { Pagination } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import ProductCard from "~/components/products/ProductCard";
import ProductCardSkeleton from "~/components/products/ProductCardSkeleton";
import ProductsFilterCard from "~/components/products/ProductsFilterCard";
import type IFilter from "~/interfaces/IFilter";
import type IPagination from "~/interfaces/IPagination";
import type IProductsPage from "~/interfaces/IProductPage";
import { api } from "~/utils/api";

const ProductSearchPage: NextPage = () => {
  const [productsData, setProductsData] = useState<IProductsPage>({ products: [], size: 9 });
  const [productFilter, setProductFilter] = useState<IFilter>({ currentFilter: {}, savedFilter: {} });
  const [paginataion, setPagination] = useState<IPagination>({
    currentNumberPage: 1,
    totalNumberPages: 1,
    isNewFilterRequest: true,
    updatePagination: false
  });

  const [refresh, setRefresh] = useState(false);

  const { isFetching, refetch } = api.product.getAllWithFilter.useQuery({
    categoryId: productFilter.savedFilter.categoryId,
    minPrice: productFilter.savedFilter.minPrice,
    maxPrice: productFilter.savedFilter.maxPrice,
    queryName: productFilter.savedFilter.query,
    page: paginataion.currentNumberPage,
    size: productsData.size,
    isNewFilterRequest: paginataion.isNewFilterRequest
  }, {
    enabled: false,
  });

  const productsSearch = async () => {
    const { data } = await refetch();
    if (data?.productData) {
      setProductsData(prevValue => ({
        ...prevValue,
        products: data.productData
      }));
    }

    if (data?.count !== undefined) setPagination(prevValue => ({
      ...prevValue,
      currentNumberPage: 1,
      totalNumberPages: Math.ceil((data.count || 0) / productsData.size),
      isNewFilterRequest: false
    }));
  };

  useEffect(() => {
    productsSearch().catch(err => console.log(err));
  }, [refresh])

  const handlePageChange = (e: ChangeEvent<unknown>, p: number) => {
    setPagination(prevValue => ({ ...prevValue, currentNumberPage: p }));
    setRefresh(prevValue => !prevValue);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleUpdateFilterChange = () => {
    setProductFilter(prevState => ({ ...prevState, savedFilter: prevState.currentFilter }));
    setPagination(prevState => ({ ...prevState, currentNumberPage: 1, isNewFilterRequest: true }));
    setRefresh(prevValue => !prevValue);
  }

  return (
    <>
      <Head>
        <title>E-Shop</title>
        <meta name="description" content="CRM Furniture" />
      </Head>
      <main>
        <div className="px-12 py-6 grid grid-cols-12 gap-12 items-start">
          <div className="col-span-3">
            <ProductsFilterCard categoryId={productFilter.currentFilter.categoryId} setProductFilter={setProductFilter} handleUpdateFilterChange={handleUpdateFilterChange} />
          </div>
          <div className="col-span-9 grid grid-cols-3 gap-5 auto-rows-fr items-stretch">
            {
              isFetching
                ? Array.from(Array(productsData.size), (item, index) => { return (<ProductCardSkeleton key={index} />) })
                :
                <>
                  {
                    productsData.products.map(product => {
                      return (
                        <ProductCard key={product.productId} product={product} />
                      )
                    })
                  }
                </>
            }
            {
              // productsApi.data && productsApi.data.length === 0 && <div className="text-2xl">Нет подходящих элементов</div>
            }

          </div>
        </div>
        <Pagination className="flex justify-center" onChange={handlePageChange} count={paginataion.totalNumberPages} page={paginataion.currentNumberPage} color="primary" />
      </main>
    </>
  );
};

export default ProductSearchPage;
