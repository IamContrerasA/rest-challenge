import express, { Router } from 'express'
import { userRoutes } from './users.route'

const router = express.Router()

export function apiRouter(app: Router): Router {
  app.use('/accounts', userRoutes())

  return router
}
