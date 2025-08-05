import { Router } from "express";
import { authMiddleware } from "../middlewares/authMidleware";
import * as enrolllmentController from '../controllers/enrollmentController'

const enrollmentRouter = Router()

enrollmentRouter.post('/', authMiddleware, enrolllmentController.subscribe)
enrollmentRouter.delete('/', authMiddleware, enrolllmentController.unsubscribeCourse)

export default enrollmentRouter