import { Router } from "express";
import * as courseController from "../controllers/courseController";
import { authMiddleware } from "../middlewares/authMidleware";


const coursersRouter = Router()

coursersRouter.get('/', courseController.getAllCourses)
coursersRouter.get('/search', courseController.getCourseByName)
coursersRouter.get('/teacher', authMiddleware, courseController.getCoursesByTeacherId)
coursersRouter.get('/:id', courseController.getCourseById)
coursersRouter.get('/:id/reviews', courseController.getReviewsByCourseId)
coursersRouter.get('/:id/enrollments', courseController.getEnrollmentsByCourseId)
coursersRouter.post('/', authMiddleware, courseController.createCourse)
coursersRouter.put('/:id', authMiddleware, courseController.updateCourse)
coursersRouter.delete('/:id', authMiddleware, courseController.deleteCourse)

export default coursersRouter