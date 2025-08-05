import { prisma } from "../database/prisma"
import { RatingType, UpdateRatingType } from "../types/modelsType"


export const getRatingById = async (id: number) => {
    const rating = await prisma.rating.findFirst({ where: { id } })

    return rating
}

export const createRating = async (data: RatingType) => {
    const newRating = await prisma.rating.create({ data })

    return newRating
}

export const updatedRating = async (id: number, data: UpdateRatingType) => {
    const updatedRating = await prisma.rating.update({ where: { id }, data })

    return updatedRating
}

export const deleteRating = async (id: number) => {
    const deletedRating = await prisma.rating.delete({ where: { id } })

    return deletedRating
}

