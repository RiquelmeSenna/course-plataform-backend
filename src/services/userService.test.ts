import { describe, test, expect, beforeAll } from '@jest/globals'
import * as userService from './userService'
import { User } from '@prisma/client'
import { prisma } from '../database/prisma'
import { createStudentUser } from '../utils/objectTest'

describe("Should test all functions on user service", () => {
    let user: User

    beforeAll(async () => {
        user = await prisma.user.create({ data: await createStudentUser() })
    })

    test("Should find the user logged", async () => {
        const userLogged = await userService.findUserLogged(user.email)

        expect(userLogged.email).toBe(user.email)
    })

    test("Shouldn't find user logged because user is not logged", async () => {
        await expect(() => {
            return userService.findUserLogged('usernotlogged@gmail.com')
        }).rejects.toThrow('User is not logged')
    })

    test('Should find user by id', async () => {
        const userById = await userService.findUserById(user.id)

        expect(userById.email).toBe(user.email)
    })

    test("Shouldn't find user by id because user not exist", async () => {
        await expect(() => {
            return userService.findUserById(999)
        }).rejects.toThrow('User not exist')
    })

    test("Should update user", async () => {
        const updatedUser = await userService.updateUser(user.email, {
            name: 'Riquelme Senna 2.0'
        })

        expect(updatedUser.name).toBe('Riquelme Senna 2.0')
    })

    test("Shouldn't update user because user is not logged", async () => {
        await expect(() => {
            return userService.updateUser('emailfalso@gmail.com', { name: 'riquelmesenna' })
        }).rejects.toThrow('User is not logged')
    })

    test("Shouldn't update user because email data already exist", async () => {
        await expect(() => {
            return userService.updateUser(user.email, { email: user.email })
        }).rejects.toThrow('Email already used')
    })

    test('Should delete user', async () => {
        const deletedUser = await userService.deleteUser(user.email)

        expect(deletedUser).toBeTruthy()
    })

    test("Shouldn't delete user because user is not logged", async () => {
        await expect(() => {
            return userService.deleteUser('emailfalso@gmail.com')
        }).rejects.toThrow('User is not logged')
    })


})