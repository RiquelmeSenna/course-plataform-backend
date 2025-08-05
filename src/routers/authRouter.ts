import { Router } from "express";
import * as authController from "../controllers/authController";

const authRouter = Router();

authRouter.post('/signup', authController.signUp);
authRouter.post('/signin', authController.signin);
authRouter.delete('/delete', authController.deleteUsers);

export default authRouter;