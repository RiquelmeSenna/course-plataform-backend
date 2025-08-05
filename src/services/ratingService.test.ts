import { describe, test, expect, afterAll } from '@jest/globals'
import { Course, CourseCategory, Enrollment, Rating, User } from '@prisma/client'
import * as utilObject from '../utils/objectTest'
import { prisma } from '../database/prisma'
import * as ratingService from './ratingService'


describe("Should test all function from rating Service", () => {
    let teacherUser: User
    let studentUser: User
    let course: Course
    let courseCategory: CourseCategory
    let enrollmentCourse: Enrollment
    let newRating: Rating


    beforeAll(async () => {
        teacherUser = await prisma.user.create({ data: await utilObject.createTeacherUser() })
        studentUser = await prisma.user.create({ data: await utilObject.createStudentUser() })
        courseCategory = await prisma.courseCategory.create({ data: await utilObject.createCategoryTest() })
        course = await prisma.course.create({ data: { ...await utilObject.createCourseTest(), categoryId: courseCategory.id, teacherId: teacherUser.id } })
        enrollmentCourse = await prisma.enrollment.create({ data: { ...await utilObject.createEnrollmentTest(), courseId: course.id, studentId: studentUser.id } })
    })

    test("Should create a new rating", async () => {
        newRating = await ratingService.createRating(studentUser.email, 5, enrollmentCourse.courseId, 'Curso muito bom')

        expect(newRating).toHaveProperty('id')
        expect(newRating.rating).toBe(5)
    })

    test("Shouldn't create a new rating because course not exist", async () => {
        await expect(() => {
            return ratingService.createRating(studentUser.email, 5, 999, 'Curso muito bom')
        }).rejects.toThrow("Course not exist")
    })

    test("Should update rating", async () => {
        const updatedRating = await ratingService.updateRating(studentUser.email, newRating.id, {
            rating: 4
        })

        expect(updatedRating.rating).toBe(4)
    })

    test("Shouldn't update rating because not exist rating", async () => {
        await expect(() => {
            return ratingService.updateRating(studentUser.email, 999, {
                rating: 5
            })
        }).rejects.toThrow("User don't have this rating")
    })

    test("Should delete rating", async () => {
        const deletedRating = await ratingService.deleteRating(studentUser.email, newRating.id)

        expect(deletedRating).toBeTruthy()
    })

    test("Shouldn't delete rating because rating not exist", async () => {
        await expect(() => {
            return ratingService.deleteRating(studentUser.email, 999)
        }).rejects.toThrow("User don't have this rating")
    })

    afterAll(async () => {
        await prisma.enrollment.delete({ where: { id: enrollmentCourse.id } })
        await prisma.course.delete({ where: { id: course.id } })
        await prisma.user.delete({ where: { id: teacherUser.id } })
        await prisma.user.delete({ where: { id: studentUser.id } })
        await prisma.courseCategory.delete({ where: { id: courseCategory.id } })
    })

})