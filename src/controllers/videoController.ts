import { Request, Response } from 'express'
import * as videoService from '../services/videoService'
import * as videoValidation from '../validations/videoValidation'

export const getVideo = async (req: Request, res: Response): Promise<void> => {
    const safeData = videoValidation.videoIdSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const video = await videoService.getVideoById(parseInt(safeData.data.id), req.UserEmail as string)

        res.status(200).json({
            video: {
                name: video.name,
                description: video.description,
                duration: video.duration
            }
        })
    } catch (error) {
        res.status(500).json({ error: "Não foi possivel achar o video" })
    }
}

export const createVideo = async (req: Request, res: Response): Promise<void> => {
    const safeData = videoValidation.createVideoSchema.safeParse(req.body)

    if (!req.body) {
        res.status(400).json({ error: 'Mande algum dado!' })
        return
    }

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const newVideo = await videoService.createVideo(req.UserEmail as string, {
            description: safeData.data.description,
            duration: safeData.data.duration,
            moduleId: safeData.data.moduleId,
            name: safeData.data.name,
            url: safeData.data.url
        })

        res.status(201).json(newVideo)
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel criar o video' })
    }
}

export const updateVideo = async (req: Request, res: Response): Promise<void> => {
    const safeDataParams = videoValidation.videoIdSchema.safeParse(req.params)
    const safeDataBody = videoValidation.updateVideoSchema.safeParse(req.body)

    if (!req.body) {
        res.status(400).json({ error: 'Mande algum dado!' })
        return
    }

    if (!safeDataParams.success) {
        res.status(400).json({ error: safeDataParams.error.flatten().fieldErrors })
        return
    }

    if (!safeDataBody.success) {
        res.status(400).json({ error: safeDataBody.error.flatten().fieldErrors })
        return
    }

    try {
        const updatedVideo = await videoService.updateVideo(parseInt(safeDataParams.data.id as string), req.UserEmail as string, {
            description: safeDataBody.data.description,
            duration: safeDataBody.data.duration,
            name: safeDataBody.data.name,
            url: safeDataBody.data.url
        })

        res.status(200).json(updatedVideo)
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel atualizar o video' })
    }
}

export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
    const safeData = videoValidation.videoIdSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        await videoService.deleteVideo(req.UserEmail as string, parseInt(safeData.data.id))

        res.status(200).json({ deleted: true })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel deletar o video' })
    }
}
