import { User } from "@prisma/client"
import { prisma } from "../database/prisma"
import { newUser } from "../types/modelsType"


export const signUp = async (data: newUser) => {
    const newUser = await prisma.user.create({ data })

    return newUser
}

export const signIn = async (email: string, password: string) => {
    const user = await prisma.user.findFirst({ where: { email, password } })
    return user
}

export const deleteAllUsers = async () => {
    const deletedUser = await prisma.user.deleteMany()
    return deletedUser
}