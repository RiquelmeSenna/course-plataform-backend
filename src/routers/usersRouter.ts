import { Router } from "express";
import { authMiddleware } from "../middlewares/authMidleware";
import * as userController from '../controllers/userController'

const userRouter = Router()

userRouter.get('/me', authMiddleware, userController.getMe)
userRouter.get('/:id', userController.getUserById)
userRouter.put('/me', authMiddleware, userController.updateUser)
userRouter.put('/me/photo', authMiddleware, userController.uploadMiddleware, userController.uploadProfileImage)
userRouter.delete('/me', authMiddleware, userController.deleteUser)

export default userRouter