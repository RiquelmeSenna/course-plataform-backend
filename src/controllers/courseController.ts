import { Request, Response } from "express";
import * as courseService from '../services/courseService'
import * as courseValidator from '../validations/courserValidation'
import { findUserByEmail } from "../models/userModel";
import { createStripePayment } from "../utils/stripe";


export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const courses = await courseService.getAllCourses()
        res.status(200).json({
            Courses: courses.map(course => {
                return {
                    name: course.name,
                    description: course.description,
                    price: course.price,
                    category: course.category
                }
            })
        })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel achar cursos' })
    }
}

export const getCourseById = async (req: Request, res: Response) => {
    const safeData = courseValidator.courseIdSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const course = await courseService.getCourseById(parseInt(safeData.data.id))
        res.status(200).json({
            course: {
                id: course.id,
                name: course.name,
                description: course.description,
                price: course.price,
                category: course.category,
                module: course.Module
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel achar o curso' })
    }

}
export const getCourseByName = async (req: Request, res: Response) => {
    const safeData = courseValidator.courseNameSchema.safeParse(req.query)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const courses = await courseService.getCourseByName(safeData.data.name)
        res.status(200).json({
            Courses: courses.map(course => {
                return {
                    name: course.name,
                    description: course.description,
                    price: course.price,
                    category: course.category
                }
            })
        })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel achar o curso' })
    }
}

export const getReviewsByCourseId = async (req: Request, res: Response) => {
    const safeData = courseValidator.courseIdSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const reviews = await courseService.getReviewsByCourseId(parseInt(safeData.data.id))
        res.status(200).json({
            Reviews: reviews.map(review => {
                return {
                    rating: review.rating,
                    comment: review.comment,
                    student: {
                        name: review.student.name,
                        email: review.student.email,
                    }
                }
            })
        })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel achar as reviews do curso' })
    }

}

export const getEnrollmentsByCourseId = async (req: Request, res: Response) => {
    const safeData = courseValidator.courseIdSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const enrollments = await courseService.getEnrollmentsByCourseId(parseInt(safeData.data.id))
        res.status(200).json(enrollments)
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel achar as inscrições do curso' })
    }
}

export const getCoursesByTeacherId = async (req: Request, res: Response) => {
    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(400).json({ error: 'Usuario não encontrado' })
        return
    }
    try {
        const courses = await courseService.getCoursesByTeacherId(user.id)
        res.status(200).json({
            Courses: courses.map(course => {
                return {
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    price: course.price,
                    category: course.category.name,
                    module: course.Module.map(module => module)
                }
            })
        })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel achar os cursos do professor' })
    }
}

export const createCourse = async (req: Request, res: Response) => {
    const safeData = courseValidator.newCourseSchema.safeParse(req.body)

    if (!req.body) res.status(400).json({ error: 'Nenhum dado foi enviado' })

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(400).json({ error: 'Usuario não encontrado' })
        return
    }

    try {
        const stripePayment = await createStripePayment(safeData.data.name, safeData.data.price, safeData.data.description)

        const newCourse = await courseService.createCourse({
            categoryId: safeData.data.categoryId,
            description: safeData.data.description,
            name: safeData.data.name,
            price: safeData.data.price,
            teacherId: user.id,
            stripeProductId: stripePayment.id
        }, user.email)

        res.status(201).json({
            course: {
                name: newCourse.name,
                description: newCourse.description,
                price: newCourse.price,
                category: newCourse.category,
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel criar o curso' })
    }
}

export const updateCourse = async (req: Request, res: Response) => {
    const safeDataBody = courseValidator.courseUpdateSchema.safeParse(req.body)
    const safeDataParams = courseValidator.courseIdSchema.safeParse(req.params)

    if (!req.body) {
        res.status(400).json({ error: 'Nenhum dado foi enviado' })
        return
    }

    if (!safeDataParams.success) {
        res.status(400).json({ error: safeDataParams.error.flatten().fieldErrors })
        return

    }

    if (!safeDataBody.success) {
        res.status(400).json({ error: safeDataBody.error.flatten().fieldErrors })
        return
    }

    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(400).json({ error: 'Usuario não encontrado' })
        return
    }

    try {
        const updatedCourse = await courseService.updateCourse(parseInt(safeDataParams.data.id), user.email, {
            categoryId: safeDataBody.data.categoryId,
            description: safeDataBody.data.description,
            name: safeDataBody.data.name,
            price: safeDataBody.data.price,
        })

        res.status(200).json({
            course: {
                name: updatedCourse.name,
                description: updatedCourse.description,
                price: updatedCourse.price,
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel atualizar o curso' })
    }

}

export const deleteCourse = async (req: Request, res: Response) => {
    const safeData = courseValidator.courseIdSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(400).json({ error: 'Usuario não encontrado' })
        return
    }

    try {
        const deletedCourse = await courseService.deleteCourse(parseInt(safeData.data.id), user.email)
        res.status(200).json({ Deleted: true })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel deletar o curso' })
    }
}
