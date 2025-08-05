import { findUserByEmail } from '../models/userModel';
import * as moduleService from '../services/moduleService';
import * as moduleValidator from '../validations/moduleValidation';
import { Request, Response } from 'express';

export const getModuleById = async (req: Request, res: Response) => {
    const safeData = moduleValidator.moduleByIdSchema.safeParse(req.params);

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    try {
        const module = await moduleService.getModuleById(parseInt(safeData.data.id), req.UserEmail as string);

        res.status(200).json({
            module: {
                name: module.name,
                description: module.description,
                video: module.Video
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao buscar o módulo' })
    }
}

export const createModule = async (req: Request, res: Response) => {
    const safeData = moduleValidator.createModuleSchema.safeParse(req.body);

    if (!req.body) {
        res.status(400).json({ error: 'Mande algum dado' })
        return
    }
    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }


    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(404).json({ error: 'Usuario não encontrado' })
        return
    }

    try {
        const updatedModule = await moduleService.createModule({
            courseId: safeData.data.courseId,
            description: safeData.data.description,
            name: safeData.data.name
        }, user.email)

        res.status(201).json({
            Module: {
                name: updatedModule.name,
                description: updatedModule.description
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o módulo' })
    }

}

export const updateModule = async (req: Request, res: Response) => {
    const safeData = moduleValidator.updateModuleSchema.safeParse(req.body);
    const safeDataParams = moduleValidator.moduleByIdSchema.safeParse(req.params);

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    if (!safeDataParams.success) {
        res.status(400).json({ error: safeDataParams.error.flatten().fieldErrors })
        return
    }

    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(404).json({ error: 'Usuario não encontrado' })
        return
    }

    try {
        const updatedModule = await moduleService.updateModule(user.email, parseInt(safeDataParams.data.id),
            safeData.data.description as string, safeData.data.name as string)

        res.status(200).json({
            Module: {
                name: updatedModule.name,
                description: updatedModule.description
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel atualizar o modulo' })
    }
}

export const deleteModule = async (req: Request, res: Response) => {
    const safeData = moduleValidator.moduleByIdSchema.safeParse(req.params)

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(400).json({ error: 'Usuario não encontrado' })
        return
    }

    try {
        const deletedModule = await moduleService.deleteModule(user.email, parseInt(safeData.data.id))

        res.status(200).json({ Deleted: true })
    } catch (error) {
        res.status(500).json({ error: 'Não foi possivel deletar o modulo' })
    }
}
