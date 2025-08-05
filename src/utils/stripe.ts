import Stripe from "stripe";
import { getCourseById } from "../models/coursesModel";
import { findUserById, updateUserByEmail } from "../models/userModel";
import { subscribeCourse } from "../models/enrollmentModel";



export const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
    httpClient: Stripe.createFetchHttpClient()
});

export const getStripeCustomerByEmail = async (email: string) => {
    const customers = await stripe.customers.list({ email })

    return customers.data[0]
}

export type DataStripe = {
    email: string,
    name?: string
}

export const createStripeCustomer = async (data: DataStripe) => {
    const customer = await getStripeCustomerByEmail(data.email)

    if (customer) return customer

    return stripe.customers.create({
        email: data.email,
        name: data.name
    })
}

export const createStripePayment = async (name: string, price: number, description: string) => {
    const newPayment = await stripe.products.create({
        name,
        active: true,
        description,

    })

    const newPrice = await stripe.prices.create({
        currency: 'brl',
        unit_amount: price * 100,
        product: newPayment.id
    })

    await stripe.products.update(newPayment.id, {
        default_price: newPrice.id
    })


    return newPayment
}

export const updateStripePayment = async (id: string, price?: number, name?: string) => {
    const product = await stripe.products.retrieve(id)
    const newPrice = await stripe.prices.create({
        currency: 'brl',
        unit_amount: price as number * 100,
        product: id
    })

    await stripe.products.update(id, {
        name
    })


    await stripe.products.update(product.id, {
        default_price: newPrice.id
    })

    const deletedPrice = await stripe.prices.update(product.default_price as string, {
        active: false
    })
}

export const archiveStripePayment = async (id: string) => {
    const product = await stripe.products.update(id, {
        active: false
    })

}

export const generateCheckout = async (userId: string, email: string, courseId: number) => {
    const course = await getCourseById(courseId)

    if (!course) throw new Error('Course Not found')

    try {
        const customer = await createStripeCustomer({ email })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            client_reference_id: userId, //User ID database
            customer: customer.id,
            success_url: 'http://127.0.0.1:5500/frontend/pages/home/initial.html',
            cancel_url: 'http://localhost:4000/error',
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        unit_amount: course.price * 100,
                        product: course.stripeProductId
                    },
                    quantity: 1
                }
            ],
            metadata: {
                courseId,
                studentId: userId
            }
        })

        return {
            url: session.url
        }
    } catch (error) {
        console.log('err', error)
        throw error
    }
}

type CheckoutCompletedEvent = {
    data: {
        object: Stripe.Checkout.Session
    }
}

export const handleCheckoutCompleted = async (event: CheckoutCompletedEvent) => {
    const idUser = event.data.object.client_reference_id;
    const stripeCustomerId = event.data.object.customer
    const checkoutStatus = event.data.object.status;

    if (checkoutStatus !== 'complete') {
        console.log('Checkout not completed')
        return;
    }

    if (!idUser || !stripeCustomerId) {
        console.log('IdUser, stripeCustomerId is required')
        throw new Error('IdUser, stripeCustomerId is required')
    }

    const userExist = await findUserById(parseInt(idUser))

    if (!userExist) throw new Error('User not found')

    await updateUserByEmail(userExist.email, {
        stripeCustomerId: stripeCustomerId as string
    })

    console.log('teste 1 deu certo')

    //await subscribeCourse({ studentId: userExist.id, courseId: parseInt(courseId as string) })
}