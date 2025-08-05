import { z } from "zod";

export const videoIdSchema = z.object({
    id: z.string({ message: 'Mande o id do video' })
})

export const createVideoSchema = z.object({
    name: z.string({ message: 'Mande um nome' }).min(4, { message: 'Nome com no minimo 4 caracteres' }),
    description: z.string({ message: 'Mande a descrição' }).min(10, { message: 'Descrição no minimo de 4 caracteres' }),
    url: z.string({ message: 'Mande uma url' }).url({ message: 'Mande uma url válida' }),
    duration: z.number({ message: 'Mande a duração do video' }).min(0.01, { message: 'Video com duração no minimo de 1 segundo' }),
    moduleId: z.number({ message: 'Mande o id do modulo' })
})

export const updateVideoSchema = z.object({
    name: z.string().min(4, { message: 'Nome com no minimo 4 caracteres' }).optional(),
    description: z.string().min(10, { message: 'Descrição com no minimo 10 caracteres' }).optional(),
    url: z.string().url({ message: 'Mande uma url válida' }).optional(),
    duration: z.number().min(0.01, { message: 'Video com duração no minimo de 1 segundo' }).optional()
})