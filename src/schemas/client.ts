import { Client } from "@prisma/client";
import { toZod } from "tozod";
import { z } from "zod";

const clientSchema: toZod<Client> = z.object({
    clientId: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string(),
    password: z.string(),
    phone: z.string().nullable(),
    refreshToken: z.string().nullable()
})

export { clientSchema };