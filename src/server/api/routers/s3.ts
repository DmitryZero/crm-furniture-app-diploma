import { PutObjectCommand } from '@aws-sdk/client-s3';
import { z } from 'zod';
import { env } from '~/env.mjs';
import client from '~/s3/s3Client';
import { elmaProcedure, protectedProcedure } from '~/server/api/trpc';
import fs from 'fs'

import { createTRPCRouter } from "~/server/api/trpc";
import { Buffer } from 'buffer';

export const s3router = createTRPCRouter({
    createProductImgFromElma: elmaProcedure
        .input(z.object({
            fileName: z.string(),
            body: z.string()
        }))
        .mutation(async ({ input }) => {
            try {
                const command = new PutObjectCommand({
                    Bucket: env.NEXT_PUBLIC_S3_BUCKET,
                    Key: `products/${input.fileName}`,
                    Body: Buffer.from(input.body, "base64")
                });
                const response = await client.send(command);
                return response;
            } catch (e) {
                console.log(e);
            }
        }),
    createContractFromElma: elmaProcedure
        .input(z.object({
            fileName: z.string(),
            body: z.string(),
            orderId: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const command = new PutObjectCommand({
                    Bucket: env.NEXT_PUBLIC_S3_BUCKET,
                    Key: `contracts/${input.orderId}/${input.fileName}`,
                    Body: Buffer.from(input.body, "base64")
                });
                const response = await client.send(command);

                const document = await ctx.prisma.document.create({
                    data: {
                        documentType: "contract",
                        documentName: input.fileName,
                        documentSrc: `${env.NEXT_PUBLIC_S3_URL}/${env.NEXT_PUBLIC_S3_BUCKET}/contracts/${input.orderId}/${input.fileName}`,
                        Order: {
                            connect: {
                                orderId: input.orderId
                            }
                        }
                    }
                })

                return response;
            } catch (e) {
                console.log(e);
            }
        }),
    createFiles: protectedProcedure
        .input(z.object({
            files: z.object({
                name: z.string(),
                body: z.string().nullish()
            }).array(),
            orderId: z.string().uuid()
        }))
        .mutation(async ({ input }) => {
            try {
                const commands = input.files.map((item, index) => {
                    if (!item.body) return undefined;

                    return new PutObjectCommand({
                        Bucket: env.NEXT_PUBLIC_S3_BUCKET,
                        Key: `orderFiles/${input.orderId}/${item.name}`,
                        Body: Buffer.from(input.files[0]?.body!, "base64")
                    });
                });

                const arrayBuffer = input.files[0]!.body!;
                console.log("arrayBuffer", arrayBuffer);

                const buffer = Buffer.from(JSON.stringify(arrayBuffer));
                console.log("Buffer", buffer);

                console.log(commands);

                const response = await Promise.all(commands.map(command => command ? client.send(command) : undefined));
                return response;
            } catch (e) {
                console.log(e);
            }
        })
});
