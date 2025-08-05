import * as authModel from '../models/authModel'
import { findUserByEmail } from '../models/userModel'
import bcrypt from 'bcrypt'
import { newUser } from '../types/modelsType'

export const signUp = async (data: newUser) => {
    const hasUser = await findUserByEmail(data.email)

    if (hasUser) {
        throw new Error('User has exist')
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    const newUser = await authModel.signUp({ ...data, password: passwordHash })

    if (!newUser) {
        throw new Error("It's not possible create user")
    }

    return newUser
}

export const signIn = async (email: string, password: string) => {
    const user = await findUserByEmail(email)

    if (!user) {
        throw new Error('Email not exist')
    }
    const userLogged = await authModel.signIn(user.email, user.password)

    const passwordHash = await bcrypt.compare(password, user.password)

    if (!passwordHash) {
        throw new Error('Wrong password')
    }

    return userLogged
}