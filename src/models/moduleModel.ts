import { prisma } from "../database/prisma";
import { ModuleType, updateModuleType } from "../types/modelsType";

export const getModuleById = async (id: number) => {
    const module = await prisma.module.findFirst({
        where: { id }, include: {
            course: {
                select: {
                    teacherId: true
                }
            },
            Video: {
                select: {
                    name: true,
                    url: true,
                    VideoProgress: true
                }
            }
        }
    })

    return module
}

export const createModule = async (data: ModuleType) => {
    const newModule = await prisma.module.create({ data })

    return newModule
}

export const updateModule = async (id: number, data: updateModuleType) => {
    const updatedModule = await prisma.module.update({ where: { id }, data })

    return updatedModule
}

export const deleteModule = async (id: number) => {
    const deletedModule = await prisma.module.delete({ where: { id } })

    return deletedModule
}