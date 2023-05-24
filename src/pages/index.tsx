import { Backdrop, Button, CircularProgress, Paper } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { api } from "~/utils/api";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Product } from "@prisma/client";

const Home: NextPage = () => {

  const { data: productData, isFetching } = api.product.getAll.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });  

  function Item(props: Product) {
    return (
      <Paper className="p-4 h-[300px]">
        <h2>{props.productName}</h2>
        <p>{props.description}</p>
        {/* <div className="relative w-4/5 aspect-square">
          <Image className="object-contain" fill src={`${env.NEXT_PUBLIC_S3_URL}/test.jpg`} alt="" />
        </div> */}
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
        {
          productData &&
          <Carousel
            NextIcon={<ArrowForwardIosIcon />}
            PrevIcon={<ArrowBackIosNewIcon />}
            animation="slide"
          >
            {
              productData.map((item, i) => <Item key={i} {...item} />)
            }
          </Carousel>
        }
        {/* {isFetching && <CircularProgress color="inherit" />} */}
      </main >
    </>
  );
};

export default Home;
