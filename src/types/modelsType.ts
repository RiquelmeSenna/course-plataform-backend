export type newUser = {
    name: string,
    email: string,
    cpf: string,
    password: string,
    stripeCustomerId?: string
    type: 'Student' | 'Teacher' | 'Admin'
}

export type UpdateUser = {
    name?: string,
    email?: string,
    password?: string,
    type?: 'Student' | 'Teacher'
    stripeCustomerId?: string
}

export type CourseCategory = {
    name: string,
    description: string
}

export type updateCourseType = {
    name?: string,
    description?: string,
    categoryId?: number,
    price?: number,
    concluded?: boolean
}

export type CourseType = {
    name: string,
    price: number,
    description: string,
    categoryId: number,
    teacherId: number,
    stripeProductId: string
}

export type ModuleType = {
    name: string,
    description: string,
    courseId: number,
}

export type updateModuleType = {
    name?: string,
    description?: string
}

export type videoType = {
    name: string,
    description: string,
    url: string,
    duration: number,
    moduleId: number
}

export type videoUpdateType = {
    name?: string,
    description?: string,
    url?: string,
    duration?: number,
    moduleId?: number
}

export type EnrollmentType = {
    courseId: number,
    studentId: number,

}

export type RatingType = {
    courseId: number
    studentId: number
    rating: number
    comment?: string
}

export type UpdateRatingType = {
    rating?: number,
    comment?: string
}