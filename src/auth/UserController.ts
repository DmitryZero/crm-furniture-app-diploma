import { TRPCError } from '@trpc/server';
import { env } from "~/env.mjs";
import { prisma } from '~/server/db';
import { HmacSHA256 } from 'crypto-js';

interface IClientSignUp {
    email: string,
    fullName: string,
    password: string,
}

interface IClientSignIn {
    email: string
    password: string,
}

class UserController {
    static async signUp({ email, fullName, password }: IClientSignUp) {
        const session = await prisma.session.create({
            data: {
                client: {
                    create: {
                        email: email,
                        fullName: fullName,
                        password: HmacSHA256(password, env.HASH_KEY).toString()
                    }
                }
            },
            include: {
                client: true
            }
        })

        return session;
    }

    static async signIn({ email, password }: IClientSignIn) {

        const hashedPassword = HmacSHA256(password, env.HASH_KEY).toString()

        const client = await prisma.client.findFirst({
            where: {
                email: email,
                password: hashedPassword
            },
        });

        if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'Email invalid' })
        
        const session = await prisma.session.upsert({
            where: {
                clientId: client.clientId
            },
            update: {},
            create: {
                client: {
                    connect: {
                        clientId: client.clientId
                    }
                }
            },
            include: {
                client: true
            }
        })

        return session;
    }
}

export default UserController;