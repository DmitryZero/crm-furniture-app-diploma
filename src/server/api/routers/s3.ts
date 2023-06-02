import { PutObjectCommand } from '@aws-sdk/client-s3';
import { z } from 'zod';
import { env } from '~/env.mjs';
import client from '~/s3/s3Client';
import { elmaProcedure } from '~/server/api/trpc';

import { createTRPCRouter } from "~/server/api/trpc";

export const s3router = createTRPCRouter({
    createFile: elmaProcedure
        .input(z.object({
            elmaId: z.string(),
            body: z.string()
        }))
        .mutation(async ({ input }) => {            
            try {
                const command = new PutObjectCommand({
                    Bucket: env.S3_BUCKET,
                    Key: `products/${input.elmaId}.png`,
                    Body: Buffer.from(input.body, "base64")
                });
                const response = await client.send(command);
                return response;
            } catch (e) {
                console.log(e);
            }
        })
});
