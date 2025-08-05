import { prisma } from "../database/prisma";
import { EnrollmentType } from "../types/modelsType";

export const getEnrollment = async (studentId: number) => {
    const enrollment = await prisma.enrollment.findMany({
        where: { studentId }
    })

    return enrollment
}

export const subscribeCourse = async (data: EnrollmentType) => {
    const newEnrollment = await prisma.enrollment.create({ data })

    return newEnrollment
}

export const deleteEnrollment = async (id: number) => {
    const deletedEnrollment = await prisma.enrollment.delete({ where: { id } })

    return deletedEnrollment
}