import { describe, test, expect, afterAll, beforeAll } from '@jest/globals'
import { Course, CourseCategory, Module, User, Video } from '@prisma/client'
import { prisma } from '../database/prisma'
import * as utilObject from '../utils/objectTest'
import * as videoService from './videoService'
import { deleteCourse } from './courseService'

describe('Test all function from video service', () => {
    let teacherUser: User
    let courseCategory: CourseCategory
    let course: Course
    let module: Module
    let newVideo: Video

    beforeAll(async () => {
        teacherUser = await prisma.user.create({ data: await utilObject.createTeacherUser() })
        courseCategory = await prisma.courseCategory.create({ data: await utilObject.createCategoryTest() })
        course = await prisma.course.create({ data: { ...await utilObject.createCourseTest(), categoryId: courseCategory.id, teacherId: teacherUser.id } })
        module = await prisma.module.create({ data: { ...await utilObject.createModuleTest(), courseId: course.id } })
    })

    test("Should create a new video", async () => {
        newVideo = await videoService.createVideo(teacherUser.email, {
            description: 'Video numero 1 do modulo 1',
            duration: 1,
            moduleId: module.id,
            name: 'Video 1 - Introdução',
            url: 'https://youtu.be/jX-ooBxY9Mw?si=AvFw7e5-uYrKK5y3'
        })

        expect(newVideo.name).toBe('Video 1 - Introdução')
        expect(newVideo).toHaveProperty('id')
    })

    test("Shouldn't create a new video because module not exist", async () => {
        await expect(() => {
            return videoService.createVideo(teacherUser.email, {
                description: 'Video numero 1 do modulo 1',
                duration: 1,
                moduleId: 999,
                name: 'Video 1 - Introdução',
                url: 'https://youtu.be/jX-ooBxY9Mw?si=AvFw7e5-uYrKK5y3'
            })
        }).rejects.toThrow('Module not exist')
    })

    test("Shouldn't create a new video because user is not teacher this course", async () => {
        await expect(() => {
            return videoService.createVideo('emailtestefalso@gmail.com', {
                description: 'Video numero 1 do modulo 1',
                duration: 1,
                moduleId: module.id,
                name: 'Video 1 - Introdução',
                url: 'https://youtu.be/jX-ooBxY9Mw?si=AvFw7e5-uYrKK5y3'
            })
        }).rejects.toThrow('User is not teacher this course')
    })

    test("Should get video by Id", async () => {
        const video = await videoService.getVideoById(newVideo.id, teacherUser.email)

        expect(video.url).toBe('https://youtu.be/jX-ooBxY9Mw?si=AvFw7e5-uYrKK5y3')
    })

    test("Shouldn't get video by Id because video not exist", async () => {
        await expect(() => {
            return videoService.getVideoById(999, teacherUser.email)
        }).rejects.toThrow('Video not exist')
    })

    test("Shouldn't get video by id because user is not teacher this course or not have access", async () => {
        await expect(() => {
            return videoService.getVideoById(newVideo.id, 'emailtestefalso@gmail.com')
        }).rejects.toThrow("You don't have access to for this course or are not the teacher")
    })

    test("Should update video", async () => {
        const updatedVideo = await videoService.updateVideo(newVideo.id, teacherUser.email, {
            duration: 2
        })

        expect(updatedVideo.duration).toBe(2)
    })

    test("Shouldn't update video because video not exist", async () => {
        await expect(() => {
            return videoService.updateVideo(999, teacherUser.email, {
                description: 'Qualquer descrição aqui!'
            })
        }).rejects.toThrow('Video not exist')
    })

    test("Shouldn't update video because user is not teacher of this course", async () => {
        await expect(() => {
            return videoService.updateVideo(newVideo.id, 'emailtestefalso@gmail.com', {
                duration: 2
            })
        }).rejects.toThrow("User is not teacher this course")
    })

    test("Shouldn't delete video because video not exist", async () => {
        await expect(() => {
            return videoService.deleteVideo(teacherUser.email, 999)
        }).rejects.toThrow('Video not exist')
    })

    test("Shouldn't delete video because user is not teacher of this course", async () => {
        await expect(() => {
            return videoService.deleteVideo('emailtestefalso@gmail.com', newVideo.id)
        }).rejects.toThrow("User is not teacher this course")
    })

    test("Should delete video", async () => {
        const deletedVideo = await videoService.deleteVideo(teacherUser.email, newVideo.id)

        expect(deletedVideo).toBeTruthy()
    })

    afterAll(async () => {
        await prisma.module.delete({ where: { id: module.id } })
        await deleteCourse(course.id, teacherUser.email)
        await prisma.courseCategory.delete({ where: { id: courseCategory.id } })
        await prisma.user.delete({ where: { id: teacherUser.id } })
    })
})