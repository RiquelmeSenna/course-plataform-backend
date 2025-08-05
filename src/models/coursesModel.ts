import { prisma } from "../database/prisma"
import { CourseType, updateCourseType } from "../types/modelsType"

export const getCourses = async () => {
    const courses = await prisma.course.findMany({
        include: {
            category: {
                select: {
                    name: true
                }
            }
        }
    })
    return courses
}

export const getCoursesByTeacherId = async (teacherId: number) => {
    const courses = await prisma.course.findMany({
        where: { teacherId },
        include: {
            Module: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                }
            },
            category: {
                select: {
                    name: true
                }
            }
        }
    })

    return courses
}

export const getCourseById = async (id: number) => {
    const course = await prisma.course.findFirst({
        where: { id },
        include: {
            category: {
                select: {
                    name: true
                }
            },
            Module: {
                select: {
                    id: true,
                    name: true,
                    ModuleProgress: true,
                    description: true
                }
            },
        }
    })
    return course
}

export const updateCourse = async (id: number, data: updateCourseType) => {
    const updatedCourse = await prisma.course.update({
        where: { id },
        data,
    })

    return updatedCourse
}

export const deleteCourse = async (id: number) => {
    const deletedCourse = await prisma.course.delete({ where: { id } })
    return deletedCourse
}

export const createCourse = async (data: CourseType) => {
    const newCourse = await prisma.course.create({
        data,
        include: {
            category: {
                select: {
                    name: true
                }
            }
        }
    })
    return newCourse
}

export const getCourseByName = async (name: string) => {
    const course = await prisma.course.findMany({
        where: {
            name: {
                contains: name,
                mode: 'insensitive'
            }
        },
        include: {
            category: {
                select: {
                    name: true
                }
            }
        }
    })
    return course
}

export const getReviewsByCourseId = async (id: number) => {
    const coursesReviews = await prisma.course.findFirst({
        where: { id },
        select: {
            Rating: {
                select: {
                    student: true,
                    comment: true,
                    rating: true,
                }
            }
        }
    })

    return coursesReviews
}

export const getModulesByCourseId = async (id: number) => {
    const coursesModules = await prisma.course.findFirst({
        where: { id },
        select: {
            Module: {
                select: {
                    name: true,
                    ModuleProgress: true,
                }
            }
        }
    })

    return coursesModules
}

export const getEnrollmentsByCourseId = async (id: number) => {
    const coursesEnrollments = await prisma.course.findFirst({
        where: { id },
        select: {
            Enrollment: {
                select: {
                    student: true,
                    course: true
                }
            }
        }
    })

    return coursesEnrollments
}
