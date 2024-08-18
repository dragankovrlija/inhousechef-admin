import { nameSchema, optionalAddressSchema, optionalPhoneSchema } from '@/schemas'
import { object, string, z } from 'zod'

export const createCompanySchema = object({
    name: nameSchema.min(1, 'Company name is a required field.'),
    code: string().min(3, 'Company code is a required field.'),
    telephone: optionalPhoneSchema,
    address: optionalAddressSchema
})

export const updateCompanySchema = object({
    company: object({
        name: nameSchema,
        code: string().min(3, 'Company code is a required field.'),
        telephone: optionalPhoneSchema,
        address: optionalAddressSchema,
        branding: object({
            // primaryColor: string().optional(),
            // secondaryColor: string().optional(),
            logo: z.instanceof(File).optional()
        })
    })
})
