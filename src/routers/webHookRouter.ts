import { raw, Router } from 'express'
import { WebHook } from '../controllers/enrollmentController'

const webHookRouter = Router()

webHookRouter.post('/', raw({ type: 'application/json' }), WebHook)

export default webHookRouter