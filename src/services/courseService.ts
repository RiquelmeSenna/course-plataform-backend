import { error } from 'console'
import * as coursesModel from '../models/coursesModel'
import { findUserByEmail, findUserById } from '../models/userModel'
import { CourseType, updateCourseType } from '../types/modelsType'
import { getCategoryById } from './categoryService'
import { archiveStripePayment, updateStripePayment } from '../utils/stripe'

export const createCourse = async (data: CourseType, email: string) => {
    const user = await findUserByEmail(email)

    if (user?.type !== 'Teacher') {
        throw new Error('You are not authorized to create this course')
    }

    const newCourse = await coursesModel.createCourse(data)

    if (!newCourse) {
        throw new Error("It's not possible to create this course")
    }

    return newCourse
}

export const getAllCourses = async () => {
    const courses = await coursesModel.getCourses()

    if (courses.length < 1) {
        throw new Error('No courses found')
    }
    return courses
}

export const getCourseById = async (id: number) => {
    const course = await coursesModel.getCourseById(id)

    if (!course) {
        throw new Error('Course not found')
    }

    return course
}

export const getCoursesByTeacherId = async (teacherId: number) => {
    const courses = await coursesModel.getCoursesByTeacherId(teacherId)
    const user = await findUserById(teacherId)
    if (!user) {
        throw new Error('User not found')
    }
    if (user.type !== 'Teacher') {
        throw new Error('You are not authorized to view these courses')
    }
    if (courses.length < 1) {
        throw new Error('No courses found for this teacher')
    }
    return courses
}

export const updateCourse = async (id: number, email: string, data: updateCourseType) => {
    const user = await findUserByEmail(email)
    const course = await coursesModel.getCourseById(id)

    if (!course) {
        throw new Error("Course not found")
    }

    if (user?.id != course?.teacherId && user?.type != 'Admin') {
        throw new Error('You are not authorized to update this course')
    }

    const updatedCourse = await coursesModel.updateCourse(id, data)
    await updateStripePayment(updatedCourse.stripeProductId, data.price, data.name)

    if (!updatedCourse) {
        throw new Error("It's not possible to update this course")
    }

    return updatedCourse
}

export const deleteCourse = async (id: number, email: string) => {
    const user = await findUserByEmail(email)
    const course = await coursesModel.getCourseById(id)

    if (!course) {
        throw new Error("Course not found")
    }

    if (user?.id != course?.teacherId && user?.type != 'Admin') {
        throw new Error('You are not authorized to delete this course')
    }

    const deletedCourse = await coursesModel.deleteCourse(id)
    await archiveStripePayment(course.stripeProductId)

    if (!deletedCourse) {
        throw new Error("It's not possible to delete this course")
    }
    return true
}

export const getCourseByName = async (name: string) => {
    const course = await coursesModel.getCourseByName(name)

    if (course.length < 1) {
        throw new Error('Courses not found')
    }

    return course
}

export const getReviewsByCourseId = async (id: number) => {
    const courseReviews = await coursesModel.getReviewsByCourseId(id)

    if (!courseReviews) {
        throw new Error('Course not found')
    }

    if (courseReviews.Rating.length < 1) {
        throw new Error('No reviews found for this course')
    }

    return courseReviews.Rating
}

export const getModulesByCourseId = async (id: number) => {
    const courseModules = await coursesModel.getModulesByCourseId(id)

    if (!courseModules) {
        throw new Error('Course not found')
    }

    if (courseModules.Module.length < 1) {
        throw new Error('No modules found for this course')
    }

    return courseModules.Module

}

export const getEnrollmentsByCourseId = async (id: number) => {
    const courseEnrollments = await coursesModel.getEnrollmentsByCourseId(id)

    if (!courseEnrollments) {
        throw new Error('Course not found')
    }

    if (courseEnrollments.Enrollment.length < 1) {
        throw new Error('No enrollments found for this course')
    }

    return courseEnrollments.Enrollment
}