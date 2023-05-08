import { z } from "zod";

const CompanySuggestionTypeSchema = z.object({
    suggestions: z.object({
        value: z.string(),
        data: z.object({
            inn: z.string().nullable(),
            address: z.object({
                value: z.string().nullable()
            })
        })
    }).array()
})

const CompanyTypeSchema = z.object({
    value: z.string(),
    data: z.object({
        inn: z.string().nullable(),
        address: z.object({
            value: z.string().nullable()
        })
    })
})

type CompanySuggestionType = z.infer<typeof CompanySuggestionTypeSchema>;
type CompanyType = z.infer<typeof CompanyTypeSchema>;

export { type CompanySuggestionType, CompanySuggestionTypeSchema, type CompanyType };