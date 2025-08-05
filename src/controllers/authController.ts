import { signinSchema, singUpSchema } from "../validations/authValidation"
import { Request, RequestHandler, Response } from 'express'
import * as authService from '../services/authService'
import { sign } from "../middlewares/authMidleware"
import { createStripeCustomer } from "../utils/stripe"
import { deleteAllUsers } from "../models/authModel"


export const signUp = async (req: Request, res: Response) => {
    const safeData = singUpSchema.safeParse(req.body)

    if (!safeData.success) {
        res.status(401).json({ error: safeData.error.flatten().fieldErrors })
        return//
    }

    try {
        const customer = await createStripeCustomer({ email: safeData.data.email, name: safeData.data.name })

        const newUser = await authService.signUp({
            cpf: safeData.data.cpf,
            email: safeData.data.email,
            name: safeData.data.name,
            password: safeData.data.password,
            type: safeData.data.type,
            stripeCustomerId: customer.id
        })

        res.status(201).json({
            user: {
                name: newUser.name,
                email: newUser.email,
                type: newUser.type,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Aconteceu algum error!' })
    }
}

export const signin = async (req: Request, res: Response) => {
    const safeData = signinSchema.safeParse(req.body)

    if (!safeData.success) {
        res.status(401).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const user = await authService.signIn(safeData.data.email, safeData.data.password)

        const token = await sign(user?.email as string)

        res.json({ token: token })
    } catch (error) {
        res.status(401).json({ error: 'Email ou senha incorreto!' })
    }
}

export const deleteUsers = async (req: Request, res: Response) => {
    try {
        const deletedUser = await deleteAllUsers()
        res.status(200).json({ message: 'Todos os usuários foram deletados com sucesso!' })
    } catch (error) {
        res.status(401).json({ error: 'Aconteceu algum error!' })
    }
}