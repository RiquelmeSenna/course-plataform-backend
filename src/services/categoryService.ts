import * as categoryModel from '../models/categoryModel'
import { findUserByEmail } from '../models/userModel'
import { CourseCategory } from '../types/modelsType'

export const newCategory = async (email: string, data: CourseCategory) => {
    const user = await findUserByEmail(email)

    if (user?.type != 'Admin') {
        throw new Error('User not authorized')
    }

    const category = await categoryModel.newCategory(data)

    if (!category) {
        throw new Error('Nothing was created')
    }

    return category
}

export const getCategories = async () => {
    const categories = await categoryModel.getCategories()

    if (categories.length === 0) {
        throw new Error("There aren't categories")
    }

    return categories
}

export const getCategoryById = async (id: number) => {
    const category = await categoryModel.getCategoryById(id)

    if (!category) {
        throw new Error('Category not exist')
    }

    return category
}

export const getCategoryByName = async (name: string) => {
    const category = await categoryModel.getCategoryByName(name)

    if (!category) {
        throw new Error('Category not exist')
    }
    return category
}

export const updateCategory = async (email: string, id: number, description?: string, name?: string) => {
    const user = await findUserByEmail(email)

    if (user?.type != 'Admin') {
        throw new Error('User not authorized')
    }

    const category = await categoryModel.getCategoryById(id)

    if (!category) {
        throw new Error('Category not exist')
    }

    const updatedCategory = await categoryModel.updateCategory(id, description, name)


    return updatedCategory
}

export const deleteCategory = async (email: string, id: number) => {
    const user = await findUserByEmail(email)

    if (user?.type != 'Admin') {
        throw new Error('User not authorized')
    }

    const category = await categoryModel.getCategoryById(id)

    if (!category) {
        throw new Error('Category not exist')
    }

    const deletedCategory = await categoryModel.deleteCategory(id)

    return true
}

export const getCategoriesByName = async (name: string) => {
    const categories = await categoryModel.getCategoriesByName(name)

    if (categories.length < 1) {
        throw new Error('Categories not exist')
    }

    return categories
}