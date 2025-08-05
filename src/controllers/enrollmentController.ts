import { Request, Response } from "express";
import * as enrollmentService from '../services/enrollmentService'
import { createEnrollmentvalidation } from "../validations/enrollmentValidation";
import { subscribeCourse } from "../models/enrollmentModel";
import { findUserByEmail } from "../models/userModel";
import { handleCheckoutCompleted, stripe } from "../utils/stripe";


export const subscribe = async (req: Request, res: Response) => {
    const safeData = createEnrollmentvalidation.safeParse(req.body)

    if (!req.body) {
        res.status(400).json({ error: "Mande uma alguma informação" })
        return
    }

    if (!safeData.success) {
        res.status(400).json({ error: safeData.error.flatten().fieldErrors })
        return
    }

    const user = await findUserByEmail(req.UserEmail as string)

    if (!user) {
        res.status(401).json({ error: 'Usuario não logado' })
        return
    }

    try {
        const checkout = await enrollmentService.checkoutCart(user.email, safeData.data.courseId)

        res.status(200).json(checkout)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Não foi possivel se inscrever' })
    }
}

export const WebHook = async (req: Request, res: Response) => {
    const pagment = req.headers['stripe-signature'] as string

    let event
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            pagment,
            process.env.STRIPE_WEBHOOK_SECRET as string
        )

        console.log('1 teste controller certo')
    } catch (error) {
        console.log('2 teste controller error')
        res.status(400).send(`Webhook Error`)
        return
    }

    switch (event.type) {
        case 'checkout.session.completed':
            console.log('3 teste controller certo')

            const session = event.data.object
            const courseId = session.metadata?.courseId
            const studentId = session.metadata?.studentId

            if (courseId && studentId) {
                await subscribeCourse({ courseId: parseInt(courseId), studentId: parseInt(studentId) })
                console.log('Enrollment criado com sucesso!');
            } else {
                console.log('Dados faltando no metadata');
            }

            await handleCheckoutCompleted(event)
            break;
        default:
            console.log(`Unhandled event type ${event.type}`)
    }
    console.log('4 teste controller certo')
    res.send()
}

export const unsubscribeCourse = async (req: Request, res: Response) => { }