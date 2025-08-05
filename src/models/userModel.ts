import { prisma } from "../database/prisma";
import { UpdateUser } from "../types/modelsType";

export const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findFirst(
        {
            where: { email },
            include: {
                Enrollment: {
                    select: {
                        course: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                concluded: true
                            }
                        }
                    }
                },
                Rating: {
                    select: {
                        id: true,
                        comment: true,
                        course: true,
                        rating: true,
                    }
                }
            }
        })

    return user
}

export const updateUserImageByEmail = async (email: string, imagePath: string) => {
    return await prisma.user.update({
        where: { email },
        data: { profileImage: imagePath }
    })
}

export const findUserById = async (id: number) => {
    const user = await prisma.user.findFirst(
        {
            where: { id },
            include: {
                Enrollment: {
                    select: {
                        course: {
                            select: {
                                name: true,
                                description: true,
                                concluded: true
                            }
                        }
                    }
                },
                Rating: {
                    select: {
                        comment: true,
                        course: true,
                        rating: true
                    }
                }
            }
        },
    )

    return user
}

export const updateUserByEmail = async (email: string, data: UpdateUser) => {
    const updatedUser = await prisma.user.update({ where: { email }, data })

    return updatedUser
}



export const deleteUserByEmail = async (email: string) => {
    const user = await prisma.user.delete({ where: { email } })

    return user
}