import { prisma } from "../database/prisma";
import { videoType, videoUpdateType } from "../types/modelsType";

export const getVideoById = async (id: number) => {
    const video = await prisma.video.findFirst({
        where: { id },
        include: {
            module: {
                include: {
                    course: {
                        select: {
                            teacherId: true
                        }
                    }
                }
            }
        }
    })

    return video
}

export const createVideo = async (data: videoType) => {
    const video = await prisma.video.create({ data })

    return video
}

export const updateVideo = async (id: number, data: videoUpdateType) => {
    const video = await prisma.video.update(
        {
            where: { id },
            data
        })

    return video
}

export const deleteVideo = async (id: number) => {
    const deletedVideo = await prisma.video.delete({ where: { id } })

    return deletedVideo
}