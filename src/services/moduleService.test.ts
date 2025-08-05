import { test, describe, expect, afterAll, beforeAll } from '@jest/globals'
import { Course, CourseCategory, Module, User } from '@prisma/client'
import * as objectTest from '../utils/objectTest'
import { prisma } from '../database/prisma'
import * as moduleService from './moduleService'
import { deleteCourse } from './courseService'

describe("Should test all function on module service", () => {
    let teacherUser: User
    let course: Course
    let courseCategory: CourseCategory
    let newModule: Module


    beforeAll(async () => {
        courseCategory = await prisma.courseCategory.create({ data: await objectTest.createCategoryTest() })
        teacherUser = await prisma.user.create({ data: await objectTest.createTeacherUser() })
        course = await prisma.course.create({ data: { ...await objectTest.createCourseTest(), categoryId: courseCategory.id, teacherId: teacherUser.id } })
    })

    test("Should create a new module", async () => {
        newModule = await moduleService.createModule({
            courseId: course.id,
            description: 'Modulo 1 de Curso de C# basico',
            name: 'Modulo 1'
        }, teacherUser.email)

        expect(newModule.name).toBe('Modulo 1')
        expect(newModule).toHaveProperty('id')
    })

    test("Shouldn't create a new module because course not exist", async () => {
        await expect(() => {
            return moduleService.createModule({
                courseId: 999,
                description: 'Modulo 1 de Curso de C# basico',
                name: 'Modulo 1'
            }, teacherUser.email)
        }).rejects.toThrow('Course not found')
    })

    test("Shouldn't create a new module because user is not teacher of course", async () => {
        await expect(() => {
            return moduleService.createModule({
                courseId: course.id,
                description: 'Modulo 1 de Curso de C# basico',
                name: 'Modulo 1'
            }, 'emailtestefalso@gmail.com')
        }).rejects.toThrow('User is not the teacher of this course')
    })

    test('Should get module by Id', async () => {
        const module = await moduleService.getModuleById(newModule.id, teacherUser.email)

        expect(module.name).toBe('Modulo 1')
    })

    test("Shouldn't get module by id because not exist", async () => {
        await expect(() => {
            return moduleService.getModuleById(999, teacherUser.email)
        }).rejects.toThrow('Module not found')
    })

    test("Shouldn't get module by id because user is don't have access or not are the teacher", async () => {
        await expect(() => {
            return moduleService.getModuleById(newModule.id, 'usertestesfalso@gmail.com')
        }).rejects.toThrow("You don't have access to for this course or are not the teacher")
    })

    test("Should update module", async () => {
        const updatedModule = await moduleService.updateModule(teacherUser.email, newModule.id, newModule.description, 'Modulo 1 v2')

        expect(updatedModule.name).toBe('Modulo 1 v2')
    })

    test("Shouldn't update module because module not found", async () => {
        await expect(() => {
            return moduleService.updateModule(teacherUser.email, 999)
        }).rejects.toThrow("Module not found")
    })

    test("Shouldn't update this module because user is not teacher", async () => {
        await expect(() => {
            return moduleService.updateModule('usertestefalso@gmail.com', newModule.id)
        }).rejects.toThrow("User is not the teacher of this course")
    })

    test("Shouldn't delete module because module not found", async () => {
        await expect(() => {
            return moduleService.deleteModule(teacherUser.email, 999)
        }).rejects.toThrow("Module not found")
    })

    test("Shouldn't delete this module because user is not teacher", async () => {
        await expect(() => {
            return moduleService.deleteModule('usertestefalso@gmail.com', newModule.id)
        }).rejects.toThrow("User is not the teacher of this course")
    })

    test("Should delete module", async () => {
        const deletedModule = await moduleService.deleteModule(teacherUser.email, newModule.id)

        expect(deletedModule).toBeTruthy()
    })

    afterAll(async () => {
        await deleteCourse(course.id, teacherUser.email)
        await prisma.courseCategory.delete({ where: { id: courseCategory.id } })
        await prisma.user.delete({ where: { id: teacherUser.id } })
    })
})