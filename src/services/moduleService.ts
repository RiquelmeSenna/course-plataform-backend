import { getCourseById } from '../models/coursesModel';
import { getEnrollment } from '../models/enrollmentModel';
import * as moduleModel from '../models/moduleModel';
import { findUserByEmail, findUserById } from '../models/userModel';
import { ModuleType } from '../types/modelsType';

export const getModuleById = async (id: number, email: string) => {
    const user = await findUserByEmail(email)
    const enrollment = await getEnrollment(user?.id as number)


    const module = await moduleModel.getModuleById(id)
    let result = enrollment.find((e) => e.courseId === module?.courseId)

    if (!module) {
        throw new Error('Module not found')
    }

    if (!result && user?.id != module?.course.teacherId) {
        throw new Error("You don't have access to for this course or are not the teacher")
    }

    console.log('Errolment', enrollment)
    console.log('Module', module)

    console.log(result)


    return module
}

export const createModule = async (data: ModuleType, email: string) => {
    const course = await getCourseById(data.courseId)

    if (!course) {
        throw new Error('Course not found')
    }

    const user = await findUserByEmail(email)

    if (user?.id !== course.teacherId) {
        throw new Error('User is not the teacher of this course')
    }

    const module = await moduleModel.createModule(data)

    return module
}

export const updateModule = async (email: string, id: number, description?: string, name?: string) => {
    const user = await findUserByEmail(email)

    const module = await moduleModel.getModuleById(id)

    if (!module) {
        throw new Error('Module not found')
    }

    const course = await getCourseById(module?.courseId)

    if (user?.id !== course?.teacherId) {
        throw new Error('User is not the teacher of this course')
    }

    const updatedModule = await moduleModel.updateModule(id, {
        description,
        name
    })

    if (!updatedModule) {
        throw new Error("Some wrong data")
    }

    return updatedModule
}

export const deleteModule = async (email: string, id: number) => {
    const user = await findUserByEmail(email)

    const module = await moduleModel.getModuleById(id)

    if (!module) {
        throw new Error('Module not found')
    }

    const course = await getCourseById(module?.courseId)

    if (user?.id !== course?.teacherId) {
        throw new Error('User is not the teacher of this course')
    }

    const deletedModule = await moduleModel.deleteModule(id)

    return deletedModule
}

