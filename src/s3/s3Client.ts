// import { env } from "~/env.mjs"
// import S3 from 'aws-sdk/clients/s3'

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

// export default s3;

const client = new S3Client({
    region: env.NEXT_PUBLIC_S3_REGION,
    endpoint: env.NEXT_PUBLIC_S3_URL,
    credentials: {
        accessKeyId: env.NEXT_PUBLIC_S3_ACCESS_KEY,
        secretAccessKey: env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
    }
});

// const client = new S3Client({
//     region: env.S3_REGION,
//     endpoint: env.S3_URL,
//     credentials: {
//         accessKeyId: env.S3_ACCESS_KEY,
//         secretAccessKey: env.S3_SECRET_ACCESS_KEY
//     }
// });

export default client;