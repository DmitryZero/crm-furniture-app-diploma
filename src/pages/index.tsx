import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";

type CategoryFilterType = {
  categoryName: string,
  categoryId: string | undefined
}

const Home: NextPage = () => {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterType>({ categoryName: 'Все категории', categoryId: undefined });
  const { data: products } = categoryFilter.categoryId !== undefined ?
    api.product.getByCategory.useQuery({ categoryId: categoryFilter.categoryId }) :
    api.product.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="CRM Furniture" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link href="https://fonts.googleapis.com/css2?family=Delicious+Handrawn&family=Titillium+Web:wght@200&display=swap" rel="stylesheet"></link>
      </Head>
      <main>
        {/* <NavBar setCategoryFilter={setCategoryFilter}></NavBar> */}
        <div className="p-3 text-secondary text-3xl">{categoryFilter.categoryName}</div>
        <div className="grid grid-cols-5 gap-3 p-3">
          <ul>
            {products && products.map(product => {
              // return (
              //   <ProductCard product={product} key={product?.productId}></ProductCard>
              // )
              return (
                <li key={product.productId}>
                  {product.productName}
                </li>
              )
            })}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Home;
