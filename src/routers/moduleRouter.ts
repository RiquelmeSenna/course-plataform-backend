import { Router } from "express";
import * as moduleController from '../controllers/moduleController';
import { authMiddleware } from "../middlewares/authMidleware";

const moduleRouter = Router();

moduleRouter.get('/:id', authMiddleware, moduleController.getModuleById);
moduleRouter.post('/', authMiddleware, moduleController.createModule);
moduleRouter.put('/:id', authMiddleware, moduleController.updateModule);
moduleRouter.delete('/:id', authMiddleware, moduleController.deleteModule);


export default moduleRouter;