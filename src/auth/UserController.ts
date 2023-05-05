import { TRPCError } from '@trpc/server';
import { env } from "~/env.mjs";
import { prisma } from '~/server/db';
import bcrypt from 'bcrypt';

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
        try {
            const client = await prisma.client.create({
                data: {
                    email: email,
                    fullName: fullName,
                    password: await bcrypt.hash(password, 3),
                    refreshToken: "tokens.refreshToken"
                }
            })

            return {
                client
            }

        } catch (error) {
            console.log(error)
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: JSON.stringify(error) })
        }
    }

    static async signIn({ email, password }: IClientSignIn) {
        try {
            

        } catch (error) {
            console.log(error)
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: JSON.stringify(error) })
        }
    }
}

export default UserController;