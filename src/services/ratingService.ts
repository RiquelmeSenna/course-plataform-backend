import { getEnrollment } from '../models/enrollmentModel'
import * as ratingModel from '../models/ratingModel'
import { findUserByEmail } from '../models/userModel'
import { RatingType, UpdateRatingType } from '../types/modelsType'
import { getCourseById } from './courseService'

export const createRating = async (email: string, rating: number, courseId: number, comment?: string) => {
    const user = await findUserByEmail(email)

    const enrollmentCourse = user?.Enrollment.find(item => item.course.id == courseId)

    if (!enrollmentCourse) {
        throw new Error("Course not exist")
    }
    const newRating = await ratingModel.createRating({
        courseId,
        rating,
        studentId: user?.id as number,
        comment
    })

    if (rating > 5 || rating < 0) {
        throw new Error("Rating max value is 5 and min value is 0")
    }

    return newRating
}

export const updateRating = async (email: string, id: number, data: UpdateRatingType) => {
    const user = await findUserByEmail(email)
    const rating = await ratingModel.getRatingById(id)

    const hasRating = user?.Rating.find(item => rating?.id == item.id)

    if (!hasRating) {
        throw new Error("User don't have this rating")
    }

    const updatedRating = await ratingModel.updatedRating(id, data)

    return updatedRating
}

export const deleteRating = async (email: string, id: number) => {
    const user = await findUserByEmail(email)
    const rating = await ratingModel.getRatingById(id)

    const hasRating = user?.Rating.find(item => rating?.id == item.id)

    if (!hasRating) {
        throw new Error("User don't have this rating")
    }

    const deletedRating = await ratingModel.deleteRating(id)

    if (!deletedRating) {
        throw new Error("It´s not possible delete this rating")
    }

    return true
}