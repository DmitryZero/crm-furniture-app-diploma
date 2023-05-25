import { Backdrop, Button, CircularProgress, Paper } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { api } from "~/utils/api";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Product } from "@prisma/client";
import Image from 'next/image';
import Link from "next/link";
import VisibilityIcon from '@mui/icons-material/Visibility';

const Home: NextPage = () => {

  const { data: productData, isFetching } = api.product.getAll.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  function Item(props: Product) {
    return (
      <Paper className="h-[300px] p-4 bg-secondary rounded-xl relative">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-9">
            <div className="text-3xl font-rubik">{props.productName}</div>
            <div>
              {props.description}
            </div>
            <Link className="absolute bottom-4 left-3 bg-primary border-2 border-primary text-white px-5 py-2 rounded-full hover:bg-secondary hover:text-accent" href={`/products/${props.productId}`}>
              <VisibilityIcon /> Подробнее
            </Link>
          </div>
          <div className="col-span-3 flex relative rounded-3xl shadow-inner shadow-primary border-2 aspect-square bg-primary">
            <div className="">
              <Image className="object-contain p-4" fill src={`data:image/jpeg;base64, ${props.productImg}`} alt="" />
            </div>
          </div>
        </div>

      </Paper>
    )
  }

  return (
    <>
      <Head>
        <title>E-Shop</title>
        <meta name="description" content="CRM Furniture" />
      </Head>
      <main className="p-4">
        <div className="mx-12">
          {
            productData &&
            <>
              <div className="text-accent text-lg font-rubik px-2">Самые продаваемые товары</div>
              <Carousel
                NextIcon={<ArrowForwardIosIcon />}
                PrevIcon={<ArrowBackIosNewIcon />}
                animation="slide"
              >
                {
                  // productData.filter(item => item.productId === "e9cc80f3-1370-4e8d-8cf0-3620f6f34da9").map((item, i) => <Item key={i} {...item} />)
                  productData.slice(0, 5).map((item, i) => <Item key={i} {...item} />)
                }
              </Carousel>
            </>
          }
        </div>
        {/* {isFetching && <CircularProgress color="inherit" />} */}
      </main >
    </>
  );
};

export default Home;
