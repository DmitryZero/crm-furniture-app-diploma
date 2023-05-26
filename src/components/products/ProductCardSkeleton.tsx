import { Skeleton } from "@mui/material";

export default function ProductCardSkeleton() {
    return (
        <>
            <div className="bg-secondary
                                  rounded-md
                                  p-3
                                  text-base
                                  border-2
                                  border-transparent                                 
                                  h-full
                                  grid grid-rows-12 items-center gap-2">
                <div className="relative min-h-[200px] row-span-10 flex flex-col justify-center">
                    <Skeleton variant="rounded" height={150}/>
                </div>
                <Skeleton variant="rounded" width="80%" className="row-span-1"/>
                <div className="row-span-1 flex justify-end">
                    <Skeleton variant="rounded" width="30%"/>
                </div>
                {/* <div className="text-lg">{product.productName}</div>
                <div className="text-end text-red-500 text-lg">{product.price} РУБ.</div> */}
            </div>

        </>
    )
}