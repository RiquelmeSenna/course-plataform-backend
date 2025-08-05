import { z } from "zod";

export const userIdSchema = z.object({
    id: z.string({ message: 'Mande o id do usuario' })
})

export const updateUserSchema = z.object({
    name: z.string().min(2, { message: "Nome com o minimo de 2 caracteres" }).optional(),
    email: z.string().email({ message: 'Mande um email' }).optional(),
    password: z.string().regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$!*&@#])[0-9a-zA-Z$!*&@#]{8,}$/,
        {
            message:
                "A senha deve conter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial",
        }).optional(),
    type: z.enum(['Student', 'Teacher']).optional(),
})