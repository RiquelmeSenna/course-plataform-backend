import { use } from 'passport'
import * as userModel from '../models/userModel'
import { UpdateUser } from '../types/modelsType'
import bcrypt from 'bcrypt'

export const findUserLogged = async (email: string) => {
    const user = await userModel.findUserByEmail(email)

    if (!user) {
        throw new Error("User is not logged")
    }

    return user
}

export const updateProfileImage = async (email: string, imagePath: string) => {
    if (!imagePath) throw new Error("Imagem obrigatória")
    return await userModel.updateUserImageByEmail(email, imagePath)
}

export const findUserById = async (id: number) => {
    const user = await userModel.findUserById(id)

    if (!user) {
        throw new Error("User not exist")
    }

    return user
}

export const updateUser = async (email: string, data: UpdateUser) => {
    const user = await userModel.findUserByEmail(email)

    if (!user) {
        throw new Error("User is not logged")
    }

    const updateData: Partial<UpdateUser> = {
        name: data.name,
        email: data.email,
        type: data.type
    }

    if (data.password) {
        const passwordHash = await bcrypt.hash(data.password as string, 10)
        updateData.password = passwordHash
    }

    const hasUser = await userModel.findUserByEmail(data.email as string)

    const updatedUser = await userModel.updateUserByEmail(user.email, {
        email: data.email,
        name: data.name,
        password: updateData.password,
        type: data.type
    })
    if (hasUser?.email == data.email) {
        throw new Error('Email already used')
    }

    if (!updatedUser) {
        throw new Error("It's not possible update User")
    }

    return updatedUser
}

export const deleteUser = async (email: string) => {
    const user = await userModel.findUserByEmail(email)

    if (!user) {
        throw new Error("User is not logged")
    }

    const deletedUser = await userModel.deleteUserByEmail(user.email)

    if (!deletedUser) {
        throw new Error("It's not possible delete user")
    }

    return true
}