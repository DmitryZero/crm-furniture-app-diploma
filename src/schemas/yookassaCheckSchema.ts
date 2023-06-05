import { z } from "zod";

const yookassaCheckschema = z.object({
    type: z.string(),
    event: z.string(),
    object: z.object({
        id: z.string(),
        status: z.string(),
        paid: z.boolean()
    })
})

type yookassCheck = z.infer<typeof yookassaCheckschema>;

export default function checkYookassaCheck(input: any): input is yookassCheck {
    const result = yookassaCheckschema.safeParse(input);
    return result.success;
}

