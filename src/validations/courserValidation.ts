import { z } from "zod";

export const courseIdSchema = z.object({
    id: z.string({ message: 'Mande o id' })
})

export const courseNameSchema = z.object({
    name: z.string({ message: 'Mande o nome' })
})

export const newCourseSchema = z.object({
    name: z.string({ message: 'Mande o nome' }).min(4, { message: 'O nome deve ter no mínimo 4 caracteres' }),
    price: z.number({ message: 'Mande o preço' }).min(0, { message: 'O preço deve ser maior que 0' }),
    description: z.string({ message: 'Mande a descrição' }).min(10, { message: 'A descrição deve ter no mínimo 10 caracteres' }),
    categoryId: z.number({ message: 'Mande a categoria' }).min(1, { message: 'A categoria deve ser maior que 0' }),
})

export const courseUpdateSchema = z.object({
    name: z.string().min(4, { message: 'o nome deve te rno minimo 2 caracteres' }).optional(),
    price: z.number().min(0, { message: 'O preço deve ser maior que 0' }).optional(),
    description: z.string().min(10, { message: 'A descrição deve ter no mínimo 10 caracteres' }).optional(),
    categoryId: z.number().min(1, { message: 'A categoria deve ser maior que 0' }).optional(),
})