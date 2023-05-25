import { Skeleton } from "@mui/material";
import { Product } from "@prisma/client"
import Image from 'next/image';
import Link from "next/link";

export default function ProductPageSkeleton() {
    return (
        <>
            <div className="flex justify-center">
                <div className="relative w-4/5 aspect-square">
                    <Skeleton height="100%" />
                </div>
            </div>
            <div className="bg-secondary rounded-md p-4 flex flex-col gap-2">
                <Skeleton variant="rounded" height={10} width="30%" />
                <Skeleton variant="rounded" height={30} className="" width="70%" />
                <Skeleton variant="rounded" height={50} className="mt-6" />
                <Skeleton variant="rounded" height={50} className="mt-6" />
                <Skeleton variant="rounded" height={100} className="mt-6" />
                <Skeleton variant="rounded" height={50} className="mt-3" width="70%" />
                {/* <div className="mt-4">
                    <Skeleton height={200} />
                </div>
                <div className="mt-4">
                    <Skeleton height={200} />
                </div>
                <div className="mt-4">
                    <Skeleton height={300} />
                </div>
                <div className="mt-4 rounded-md flex justify-center w-fit flex-col">
                    <Skeleton height={100} />
                </div> */}
            </div>
        </>
    )
}