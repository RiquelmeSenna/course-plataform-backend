import z from 'zod'

export const singUpSchema = z.object({
    name: z.string({ message: "Mande o nome do usuario" }).min(2, { message: 'Nome no minimo com 2 caracteres' }),
    email: z.string({ message: 'Mand eum E-mail' }).email({ message: 'Mande um E-mail válido' }),
    cpf: z.string({ message: 'Mande um CPF' }).min(11, { message: 'Mande um CPF válido' }),
    password: z.string().regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$!*&@#])[0-9a-zA-Z$!*&@#]{8,}$/,
        {
            message:
                "A senha deve conter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial",
        }),
    type: z.enum(['Student', 'Teacher', 'Admin'], { message: 'Mande um enum' })
})

export const signinSchema = z.object({
    email: z.string({ message: 'Mande um E-mail' }).email({ message: 'Mande um E-mail válido' }),
    password: z.string({ message: 'Mande a senha' }).min(8, { message: 'No minimo 8 caracteres' })
})

