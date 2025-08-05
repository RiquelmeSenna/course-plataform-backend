import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import { Course, CourseCategory, Enrollment, User } from '@prisma/client'
import { prisma } from '../database/prisma'
import * as utilObject from '../utils/objectTest'
import * as enrollmenteService from './enrollmentService'
import { deleteCourse } from './courseService'

describe("Should test all functions from enrollment service", () => {
    let teacherUser: User
    let studentUser: User
    let course: Course
    let courseCategory: CourseCategory


    beforeAll(async () => {
        teacherUser = await prisma.user.create({ data: await utilObject.createTeacherUser() })
        studentUser = await prisma.user.create({ data: await utilObject.createStudentUser() })
        courseCategory = await prisma.courseCategory.create({ data: await utilObject.createCategoryTest() })
        course = await prisma.course.create({ data: { ...await utilObject.createCourseTest(), categoryId: courseCategory.id, teacherId: teacherUser.id } })
    })

    test("Should test checkoutCart", async () => {
        const result = await enrollmenteService.checkoutCart(studentUser.email, course.id)

        expect(result).toBeDefined()
        expect(typeof result.url).toBe('string')
        expect(result.url).toMatch(/^https:\/\/checkout\.stripe\.com\/.+/)
    })

    afterAll(async () => {
        await deleteCourse(course.id, teacherUser.email)
        await prisma.user.delete({ where: { id: teacherUser.id } })
        await prisma.user.delete({ where: { id: studentUser.id } })
        await prisma.courseCategory.delete({ where: { id: courseCategory.id } })
    })


})