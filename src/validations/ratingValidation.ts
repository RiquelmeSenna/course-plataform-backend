import { z } from "zod";


export const ratingCreateSchema = z.object({
    courseId: z.number({ message: 'Mande o id do curso' }),
    comment: z.string().min(4, { message: 'Comentario com no minimo 4 caracteres' }).optional(),
    rating: z.number({ message: 'Mande o rating' }).min(1, { message: 'Minimo 1' }).max(5, { message: 'Maximo 5' })
})

export const ratingUpdateSchema = z.object({
    comment: z.string().min(4, { message: 'Comentario com no minimo 4 caracteres' }).optional(),
    rating: z.number({ message: 'Mande o rating' }).min(1, { message: 'Minimo 1' }).max(5, { message: 'Maximo 5' }).optional()
})

export const ratingIdSchema = z.object({
    id: z.string({ message: 'Mande o id do rating' })
})