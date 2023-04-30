import { z } from "zod";

const createLeadScheme = z.object({
    __id: z.string().uuid(),
    client: z.string().uuid().array(),
    order: z.object({
        rows: z.object({
            product: z.string().uuid().array(),
            amount: z.number()
        }).array()
    })
})

type createLeadType = z.infer<typeof createLeadScheme>;


async function createLead(context: createLeadType) {
    const result = createLeadScheme.safeParse(context)    
    if (!result.success) {
        console.log(result.error)
    } else {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer 84d5a0d6-184a-4b5f-969d-8dc7d9b993e2");

        const raw = JSON.stringify({
            context
        });
        console.log(raw);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

        try {
            // const response = await fetch("https://5b4p6ukak4ube.elma365.ru/pub/v1/app/_clients/_leads/create", requestOptions)
            const response = await fetch("http://localhost:8010/proxy/pub/v1/app/_clients/_leads/create", requestOptions)
            // const result = await response.json();
            return response.status;
        } catch (e) {
            console.log(e);            
        }
    }
}

export default createLead;