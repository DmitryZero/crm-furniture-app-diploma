import { Client } from "@prisma/client";
import { toZod } from "tozod";
import { z } from "zod";


export const clientSchema: toZod<Client> = z.object({
    clientId: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string(),
    login: z.string(),
    password: z.string(),
    phone: z.string()
}) 