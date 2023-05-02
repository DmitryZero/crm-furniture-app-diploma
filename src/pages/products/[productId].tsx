import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from 'next/image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import AddToCartBtn from "~/components/AddToCartBtn";

const ProductPage: NextPage = () => {
  const router = useRouter()
  let { productId } = router.query
  let isEnabled = true;

  if (!productId || typeof productId != 'string') {
    productId = "";
    isEnabled = false;
  }
  const product = api.product.getById.useQuery({ id: productId }, {
    enabled: isEnabled
  });

  return (
    <>
      <Head>
        <title>E-Shop</title>
        <meta name="description" content="CRM Furniture" />
      </Head>
      <main className="py-8">
        <Link className="bg-white rounded-full p-3 border-[1px] m-4 border-black border-solid hover:bg-slate-200" href="/productSearch"><ArrowBackIcon /></Link>
        {isEnabled && product.data &&
          <>
            <div className="grid grid-cols-2 row-span-2 px-24">
              <div className="flex justify-center">
                <div className="relative w-4/5 aspect-square">
                  <Image className="object-contain rounded-md border-2 border-solid border-gray-300" fill src={`data:image/jpeg;base64, ${product.data.productImg}`} alt="" />
                </div>
              </div>
              <div className="bg-white rounded-md p-4">
                <div className="text-sm">Артикул: {product.data.vendorCode}</div>
                <div className="text-4xl font-roboto">{product.data.productName}</div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">Габаритные размеры:</div>
                  <p className="whitespace-pre-line">{product.data.size}</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">Вес:</div>
                  <p className="whitespace-pre-line">{product.data.weight}</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">Описание:</div>
                  <p className="whitespace-pre-line">{product.data.description}</p>
                </div>
                <div className="mt-4 rounded-md flex justify-center w-fit flex-col">
                  <div className="text-red-700 text-2xl">Цена: {Number(product.data.price).toLocaleString()} РУБ.</div>
                  <AddToCartBtn productId={product.data.productId} />
                </div>
              </div>
            </div>
          </>
        }
      </main>
    </>
  );
};

export default ProductPage;
