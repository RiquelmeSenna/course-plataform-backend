import { getEnrollment } from '../models/enrollmentModel'
import { getModuleById } from '../models/moduleModel'
import { findUserByEmail } from '../models/userModel'
import * as videoModel from '../models/videoModel'
import { videoType, videoUpdateType } from '../types/modelsType'
import { getCourseById } from './courseService'

export const getVideoById = async (id: number, email: string) => {
    const user = await findUserByEmail(email)
    const enrollment = await getEnrollment(user?.id as number)

    const video = await videoModel.getVideoById(id)

    if (!video) {
        throw new Error("Video not exist")
    }

    if (enrollment[0]?.courseId != video.module.courseId && user?.id != video.module.course.teacherId) {
        throw new Error("You don't have access to for this course or are not the teacher")
    }

    return video
}

export const createVideo = async (email: string, data: videoType) => {
    const user = await findUserByEmail(email)
    const module = await getModuleById(data.moduleId)

    if (!module) {
        throw new Error("Module not exist")
    }

    if (user?.id != module.course.teacherId) {
        throw new Error("User is not teacher this course")
    }

    const newVideo = await videoModel.createVideo(data)

    if (!newVideo) {
        throw new Error("It's not possible create course")
    }

    return newVideo
}

export const updateVideo = async (id: number, email: string, data: videoUpdateType) => {
    const user = await findUserByEmail(email)
    const video = await videoModel.getVideoById(id)

    if (!video) {
        throw new Error("Video not exist")
    }

    if (user?.id != video.module.course.teacherId) {
        throw new Error("User is not teacher this course")
    }

    const updatedVideo = await videoModel.updateVideo(id, data)

    return updatedVideo
}

export const deleteVideo = async (email: string, id: number) => {
    const user = await findUserByEmail(email)
    const video = await videoModel.getVideoById(id)

    if (!video) {
        throw new Error("Video not exist")
    }

    if (user?.id != video.module.course.teacherId) {
        throw new Error("User is not teacher this course")
    }

    const deletedVideo = await videoModel.deleteVideo(id)

    if (!deletedVideo) {
        throw new Error("It's not possible delete video")
    }

    return true
}