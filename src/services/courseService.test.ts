import { describe, test, expect } from '@jest/globals'
import { Course, CourseCategory, User } from '@prisma/client'
import { prisma } from '../database/prisma'
import { createCategoryTest, createStudentUser, createTeacherUser } from '../utils/objectTest'
import * as courseService from './courseService'
import { createStripePayment } from '../utils/stripe'


describe("Should test all functions on course service", () => {
    let courseCategory: CourseCategory
    let teacherUser: User
    let newCourse: Course
    let studentUser: User

    beforeAll(async () => {
        courseCategory = await prisma.courseCategory.create({ data: await createCategoryTest() })
        teacherUser = await prisma.user.create({ data: await createTeacherUser() })
        studentUser = await prisma.user.create({ data: await createStudentUser() })
    })

    test("Shouldn't get course because there aren't any", async () => {
        await expect(() => {
            return courseService.getAllCourses()
        }).rejects.toThrow('No courses found')
    })

    test("Should create a new Course", async () => {
        const stripePayment = await createStripePayment('Curso NodeJS', 250, 'Curso de nodejs nivel basico/avaçado, para você novo e experiente programador')

        newCourse = await courseService.createCourse({
            categoryId: courseCategory.id,
            description: 'Curso de nodejs nivel basico/avaçado, para você novo e experiente programador',
            name: 'Curso NodeJS',
            price: 250,
            stripeProductId: stripePayment.id,
            teacherId: teacherUser.id
        }, teacherUser.email)

        expect(newCourse.name).toBe('Curso NodeJS')
        expect(newCourse.stripeProductId).toBe(stripePayment.id)
    })



    test("Should get all courses", async () => {
        const courses = await courseService.getAllCourses()

        expect(courses.length).toBeGreaterThanOrEqual(1)
    })

    test("Should get course By Id", async () => {
        const course = await courseService.getCourseById(newCourse.id)

        expect(course.name).toBe("Curso NodeJS")
    })

    test("Shouldn't get course by id because not exist", async () => {
        await expect(() => {
            return courseService.getCourseById(999)
        }).rejects.toThrow('Course not found')
    })

    test("Should get courses by name", async () => {
        const courses = await courseService.getCourseByName('NODE') // test insensitive mode

        expect(courses.length).toBeGreaterThanOrEqual(1)
        expect(courses[0].name).toBe('Curso NodeJS')
    })

    test("Shouldn't get courses by name because there aren't", async () => {
        await expect(() => {
            return courseService.getCourseByName('React')
        }).rejects.toThrow('Courses not found')
    })

    test("Should update course by Id", async () => {
        const updatedCourse = await courseService.updateCourse(newCourse.id, teacherUser.email, {
            price: 210
        })

        expect(updatedCourse.price).toBe(210)
    })

    test("Shouldn't update course because user is not teacher os course or is not admin", async () => {
        await expect(() => {
            return courseService.updateCourse(newCourse.id, studentUser.email, { concluded: true })
        }).rejects.toThrow('You are not authorized to update this course')
    })

    test("Shouldn't update course because course not exist", async () => {
        await expect(() => {
            return courseService.updateCourse(999, teacherUser.email, { concluded: true })
        }).rejects.toThrow("Course not found")
    })

    test("Shouldn't delete course because user is not teacher os course or is not admin", async () => {
        await expect(() => {
            return courseService.deleteCourse(newCourse.id, studentUser.email)
        }).rejects.toThrow('You are not authorized to delete this course')
    })

    test("Should delete course by ID", async () => {
        const deletedCourse = await courseService.deleteCourse(newCourse.id, teacherUser.email)

        expect(deletedCourse).toBeTruthy()
    })

    test("Shouldn't delete course because course not exist", async () => {
        await expect(() => {
            return courseService.deleteCourse(newCourse.id, teacherUser.email)
        }).rejects.toThrow("Course not found")
    })

    afterAll(async () => {
        await prisma.user.delete({ where: { id: teacherUser.id } })
        await prisma.courseCategory.delete({ where: { id: courseCategory.id } })
        await prisma.user.delete({ where: { id: studentUser.id } })
    })
})