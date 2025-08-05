import { z } from "zod";

export const createEnrollmentvalidation = z.object({
    courseId: z.number({ message: 'Mande o id do curso' })
})