// import { env } from "~/env.mjs"
// import S3 from 'aws-sdk/clients/s3'

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

// const s3 = new S3({
//     accessKeyId: env.S3_ACCESS_KEY, // <--- заменить
//     secretAccessKey: env.S3_SECRET_ACCESS_KEY, // <--- заменить
//     endpoint: 'https://s3.timeweb.com',
//     s3ForcePathStyle: true,
//     region: env.S3_REGION,
//     apiVersion: 'latest',
// })

// export default s3;

const client = new S3Client({
    region: env.S3_REGION,
    endpoint: 'https://s3.timeweb.com',
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY
    }
});

export default client;