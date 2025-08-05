import z from 'zod'

export const getByIdSchema = z.object({
    id: z.string({ message: "Mande o id" })
})

export const createCategorySchema = z.object({
    name: z.string({ message: 'Mande um nome' }).min(2, { message: 'O nome deve ter no mínimo 2 caracteres' }),
    description: z.string({ message: 'Mande uma descrição' }).min(10, { message: 'A descrição deve ter no mínimo 10 caracteres' }),
})

export const updateCategorySchema = z.object({
    name: z.string().min(2, { message: 'No minimo 2 caracteres' }).optional(),
    description: z.string().min(10, { message: 'No minimo 10 caracteres' }).optional(),
})

export const getCategoryByNameSchema = z.object({
    name: z.string({ message: 'Mande um nome' })
})