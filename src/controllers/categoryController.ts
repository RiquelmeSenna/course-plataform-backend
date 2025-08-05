import { Request, RequestHandler, Response } from "express";
import * as categoryService from "../services/categoryService";
import * as categorySchema from '../validations/categoryValidation'
import { findUserByEmail } from "../models/userModel";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getCategories();
        res.status(200).json({
            categories: categories.map((category) => {
                return {
                    name: category.name
                }
            })
        }
        )
    } catch (error) {
        res.status(500).json({ message: "Error ao achar as categorias" });
    }
}

export const getCategory = async (req: Request, res: Response) => {
    const safeData = categorySchema.getByIdSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const category = await categoryService.getCategoryById(parseInt(safeData.data.id))
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ message: "Error ao achar a categoria" });
    }
}

export const getCategoryByName = async (req: Request, res: Response) => {
    const safeData = categorySchema.getCategoryByNameSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const category = await categoryService.getCategoryByName(safeData.data.name)
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ message: "Error ao achar a categoria" });
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    const safeData = categorySchema.getByIdSchema.safeParse(req.params)

    if (!req.body) res.status(400).json({ error: "Corpo é obrigatorio!" })

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    const safeDataBody = categorySchema.updateCategorySchema.safeParse(req.body)

    if (!safeDataBody.success) {
        res.status(400).json({ error: safeDataBody.error.flatten().fieldErrors })
        return
    }

    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(400).json({ error: "User not found" })
        return
    }

    try {
        const updatedCategory = await categoryService.updateCategory(user.email, parseInt(safeData.data.id),
            safeDataBody.data.description as string, safeDataBody.data.name as string)
        res.status(200).json({
            Categoria: {
                name: updatedCategory.name,
                description: updatedCategory.description
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Error de atualizar a categoria" });
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    const safeData = categorySchema.getByIdSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(400).json({ error: "User not found" })
        return
    }

    try {
        const deletedCategory = await categoryService.deleteCategory(user.email, parseInt(safeData.data.id))
        res.status(200).json({ deletedCategory })
    } catch (error) {
        res.status(500).json({ message: "Error ao deletar a categoria" });
    }
}

export const createCategory = async (req: Request, res: Response) => {
    const safeData = categorySchema.createCategorySchema.safeParse(req.body)

    if (!req.body) {
        res.status(400).json({ error: "Corpo é obrigatorio!" })
        return
    }

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(400).json({ error: "User not found" })
        return
    }

    try {
        const newCategory = await categoryService.newCategory(user?.email, {
            description: safeData.data.description,
            name: safeData.data.name
        })
        res.status(201).json({
            Category: {
                name: newCategory.name,
                description: newCategory.description
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error de criar a categoria" });
    }
}

export const getCategoriesByName = async (req: Request, res: Response) => {
    const safeData = categorySchema.getCategoryByNameSchema.safeParse(req.query)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const categories = await categoryService.getCategoriesByName(safeData.data.name)
        res.status(200).json({
            categories: categories.map((category) => {
                return {
                    name: category.name,
                    description: category.description
                }
            })
        })
    } catch (error) {
        res.status(500).json({ message: "Error ao achar a categoria" });
    }
}

