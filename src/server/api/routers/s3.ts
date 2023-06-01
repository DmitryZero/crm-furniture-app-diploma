import { PutObjectCommand } from '@aws-sdk/client-s3';
import S3 from 'aws-sdk/clients/s3'
import { z } from 'zod';
import { env } from '~/env.mjs';
import client from '~/s3/s3Client';
import s3 from '~/s3/s3Client';

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const s3router = createTRPCRouter({
    createFile: publicProcedure
        .input(z.object({
            elmaId: z.string(),
            body: z.string()
        }))
        .mutation(async ({ input }) => {            
            try {
                console.log("Body", input.body)
                const command = new PutObjectCommand({
                    Bucket: env.S3_BUCKET,
                    Key: `${input.elmaId}.png`,
                    Body: Buffer.from(input.body, "base64")
                });
                const response = await client.send(command);
                return response;
            } catch (e) {
                console.log(e);
            }
        })
});
