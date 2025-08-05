import * as enrollmentModel from '../models/enrollmentModel'
import { findUserByEmail } from '../models/userModel'
import { generateCheckout } from '../utils/stripe'

export const checkoutCart = async (email: string, courseId: number) => {
    const user = await findUserByEmail(email)

    if (user?.type != 'Student') {
        throw new Error('Only students can be subscribe')
    }

    const checkout = await generateCheckout(user.id.toString(), email, courseId)

    if (checkout?.url == 'http://localhost:400/error') {
        throw new Error('Error on checkout')
    }

    return checkout
}

export const deleteEnrollment = async (email: string) => {
    const user = await findUserByEmail(email)
    const enrollment = await enrollmentModel.getEnrollment(user?.id as number)

    if (user?.id != enrollment[0]?.studentId && user?.type != 'Admin') {
        throw new Error("It's not possible delete this enrollment")
    }

    const deletedEnrollment = await enrollmentModel.deleteEnrollment(enrollment[0]?.id as number)

    if (!deletedEnrollment) {
        throw new Error("It's not possible delete this course")
    }

    return deletedEnrollment
}