import { Router } from "express";
import * as videoController from '../controllers/videoController'
import { authMiddleware } from "../middlewares/authMidleware";

const videoRouter = Router()

videoRouter.get('/:id', authMiddleware, videoController.getVideo)
videoRouter.post('/', authMiddleware, videoController.createVideo)
videoRouter.put('/:id', authMiddleware, videoController.updateVideo)
videoRouter.delete('/:id', authMiddleware, videoController.deleteVideo)


export default videoRouter