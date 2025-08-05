import { describe, test, expect, afterAll } from '@jest/globals'
import { User } from '@prisma/client'
import * as authService from '../services/authService'
import { createStudentUser, createTeacherUser } from '../utils/objectTest'
import { createStripeCustomer } from '../utils/stripe'
import { prisma } from '../database/prisma'
import bcrypt from 'bcrypt'


describe("Should test all functions on service", () => {
    let user: User
    let userExisting: User

    beforeAll(async () => {
        userExisting = await prisma.user.create({ data: await createTeacherUser() })
    })

    test("Should register a new user", async () => {
        let customer = await createStripeCustomer({ email: 'riquelmeadmin@gmail.com', name: 'Riquelme Admin' })

        user = await authService.signUp({
            email: 'riquelmeadmin@gmail.com',
            cpf: '06955734112',
            name: 'Riquelme Admin',
            password: 'Senhateste123!',
            stripeCustomerId: customer.id,
            type: 'Admin'
        })

        expect(user).toHaveProperty('id')
        expect(user.type).toBe('Admin')
        expect(user.stripeCustomerId).toBe(customer.id)
    })

    test("Shouldn't register user because exist", async () => {
        await expect(() => {
            return authService.signUp({
                cpf: userExisting.cpf,
                email: userExisting.email,
                name: userExisting.name,
                password: userExisting.password,
                type: user.type
            })
        }).rejects.toThrow('User has exist')
    })

    test("Should login ", async () => {
        const userLogin = await authService.signIn(user.email, 'Senhateste123!')

        expect(userLogin?.name).toBe(user.name)
        expect(userLogin?.email).toBe(user.email)
    })

    test("Shouldn't login because password is wrong", async () => {
        await expect(() => {
            return authService.signIn(user.email, 'senhatotalmenteerrada123!')
        }).rejects.toThrow('Wrong password')
    })

    test("Shouldn't login because email not exist", async () => {
        await expect(() => {
            return authService.signIn('emailfalso@gmail.com', 'Senhateste123!')
        }).rejects.toThrow('Email not exist')
    })

    afterAll(async () => {
        await prisma.user.delete({ where: { id: user.id } })
        await prisma.user.delete({ where: { id: userExisting.id } })
    })
})