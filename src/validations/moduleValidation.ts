import { z } from "zod";

export const moduleByIdSchema = z.object({
    id: z.string({ message: 'Mande o id do módulo' })
})

export const createModuleSchema = z.object({
    name: z.string({ message: "Mande o nome do modulo" }).min(4, { message: "O nome do modulo deve ter no mínimo 4 caracteres" }),
    description: z.string({ message: "Mande a descrição do modulo" }).min(10, { message: "A descrição do modulo deve ter no mínimo 10 caracteres" }),
    courseId: z.number({ message: 'Mande o id do curso' })
})

export const updateModuleSchema = z.object({
    name: z.string().min(4, { message: 'Mande no minimo 4 caracteres' }).optional(),
    description: z.string().min(10, { message: 'Mande no minimo 10 caracteres' }).optional(),
})