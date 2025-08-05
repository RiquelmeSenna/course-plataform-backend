import { Course, CourseCategory, Enrollment, Module, Rating, User } from "@prisma/client";
import { createStripeCustomer, createStripePayment } from "./stripe";
import { date } from "zod";

export function generateRandomCpf(): string {
    return Math.floor(Math.random() * 1000000000).toString()
}

export function generateEmail(type: string): string {
    return `riquelme${type}${Math.floor(Math.random() * 100)}@gmail.com`
}

export const createAdminUser = async () => {
    const customer = await createStripeCustomer({ email: 'riquelmeadmin@gmail.com', name: 'Riquelme Admin' })

    const adminUser: User = {
        id: Math.floor(Math.random() * 100),
        email: generateEmail('Admin'),
        cpf: generateRandomCpf(),
        name: 'Riquelme Admin',
        password: 'Senhateste123!',
        stripeCustomerId: customer.id,
        type: 'Admin',
        profileImage: 'https://example.com/profile-image.jpg'
    }

    return adminUser
}

export const createTeacherUser = async () => {
    const customer = await createStripeCustomer({ email: 'riquelmeteacher@gmail.com', name: 'Riquelme Teacher' })

    const teacherUser: User = {
        id: Math.floor(Math.random() * 100),
        email: generateEmail('Teacher'),
        cpf: generateRandomCpf(),
        name: 'Riquelme Teacher',
        password: 'Senhateste123!',
        stripeCustomerId: customer.id,
        type: 'Teacher',
        profileImage: 'https://example.com/profile-image.jpg'
    }

    return teacherUser
}

export const createStudentUser = async () => {
    const customer = await createStripeCustomer({ email: 'riquelmesenna577@gmail.com', name: 'Riquelme Senna' })

    const studentUser: User = {
        id: Math.floor(Math.random() * 100),
        email: generateEmail('Student'),
        cpf: generateRandomCpf(),
        name: 'Riquelme Senna',
        password: 'Senhateste123!',
        stripeCustomerId: customer.id,
        type: 'Student',
        profileImage: 'https://example.com/profile-image.jpg'
    }

    return studentUser
}

export const createCategoryTest = async () => {
    const category: CourseCategory = {
        id: Math.floor(Math.random() * 100),
        name: 'Desenvolvimento de Jogos',
        description: 'Categoria de Desenvolvimento de Jogos'
    }

    return category
}


export const createCourseTest = async () => {
    const payment = await createStripePayment('Curso de C#', 210, 'Curso de C# para você programar seus jogos')

    const course: Course = {
        id: Math.floor(Math.random() * 100),
        categoryId: (await createCategoryTest()).id,
        description: 'Curso de C# para você programar seus jogos',
        name: 'Curso de C#',
        price: 210,
        teacherId: (await createTeacherUser()).id,
        stripeProductId: payment.id,
        concluded: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    return course
}

export const createModuleTest = async () => {
    const module: Module = {
        id: Math.floor(Math.random() * 100),
        courseId: (await createCourseTest()).id,
        description: 'Modulo 1 do curso basico de C#',
        name: 'Curso de C#'
    }

    return module
}


export const createEnrollmentTest = async () => {
    const enrollment: Enrollment = {
        id: Math.floor(Math.random() * 100),
        courseId: (await createCourseTest()).id,
        studentId: (await createStudentUser()).id
    }

    return enrollment
}

export const createRatingTest = async () => {
    const rating: Rating = {
        id: Math.floor(Math.random() * 100),
        comment: 'Um comentario aleatorio',
        courseId: (await createCourseTest()).id,
        rating: 5,
        studentId: (await createStudentUser()).id
    }

    return rating
}

