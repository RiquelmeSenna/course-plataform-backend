import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMidleware'
import * as ratingController from '../controllers/ratingController'

const ratingRouter = Router()

ratingRouter.post('/', authMiddleware, ratingController.createRating)
ratingRouter.put('/:id', authMiddleware, ratingController.updateRating)
ratingRouter.delete('/:id', authMiddleware, ratingController.deleteRating)


export default ratingRouter