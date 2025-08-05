import { test, describe, expect } from '@jest/globals'
import { CourseCategory, User } from '@prisma/client'
import * as categoryService from './categoryService'
import { prisma } from '../database/prisma'
import { createAdminUser, createCategoryTest } from '../utils/objectTest'

describe("Should test all function from category service", () => {
    let newCategory: CourseCategory
    let adminUser: User

    beforeAll(async () => {
        adminUser = await prisma.user.create({ data: await createAdminUser() })
    })

    test("Shouldn't get categories because there aren't any", async () => {
        await expect(() => {
            return categoryService.getCategories()
        }).rejects.toThrow("There aren't categories")
    })


    test("Should create a new Category", async () => {
        newCategory = await categoryService.newCategory(adminUser.email, {
            description: 'Categoria de curso de desenvolvimento Web',
            name: 'Desenvolvimento Web'
        })

        expect(newCategory).toHaveProperty('id')
        expect(newCategory.name).toBe('Desenvolvimento Web')
    })

    test("Shouldn't create new category because admin is not user", async () => {
        await expect(() => {
            return categoryService.newCategory('riquelmetestefalso@gmail.com', {
                description: 'Categoria de curso de desenvolvimento Web',
                name: 'Desenvolvimento Web'
            })
        }).rejects.toThrow('User not authorized')
    })

    test("Should get categories", async () => {
        const categories = await categoryService.getCategories()

        expect(categories.length).toBeGreaterThanOrEqual(1)
    })

    test("Should get category By Id", async () => {
        const category = await categoryService.getCategoryById(newCategory.id)

        expect(category.name).toBe('Desenvolvimento Web')
    })

    test("Shouldn't get category because not exist", async () => {
        await expect(() => {
            return categoryService.getCategoryById(999)
        }).rejects.toThrow('Category not exist')
    })

    test("Should update category By Id", async () => {
        const updatedCategory = await categoryService.updateCategory(adminUser.email, newCategory.id, 'Categoria de curso de desenvolvimento web 2.0', 'Desenvolvimento Web 2.0')

        expect(updatedCategory.name).toBe('Desenvolvimento Web 2.0')
        expect(updatedCategory.description).toBe('Categoria de curso de desenvolvimento web 2.0')
    })

    test("Shouldn't update category because user is not admin", async () => {
        await expect(() => {
            return categoryService.updateCategory('riquelmetestefalso@gmail.com', newCategory.id, 'Categoria de curso de desenvolvimento web 3.0')
        }).rejects.toThrow('User not authorized')
    })

    test("Shouldn't update category because not exist", async () => {
        await expect(() => {
            return categoryService.updateCategory(adminUser.email, 999, 'Categoria de curso de desenvolvimento web 3.0')
        }).rejects.toThrow('Category not exist')
    })

    test("Shouldn't delete category because user is not admin", async () => {
        await expect(() => {
            return categoryService.deleteCategory('riquelmetestefalso@gmail.com', newCategory.id)
        }).rejects.toThrow('User not authorized')
    })

    test("Shouldn't delete category because not exist", async () => {
        await expect(() => {
            return categoryService.deleteCategory(adminUser.email, 999)
        }).rejects.toThrow('Category not exist')
    })

    test("Should delete category By Id", async () => {
        const deletedCategory = await categoryService.deleteCategory(adminUser.email, newCategory.id)

        expect(deletedCategory).toBeTruthy()
    })




    afterAll(async () => {
        await prisma.user.delete({ where: { id: adminUser.id } })
    })
})