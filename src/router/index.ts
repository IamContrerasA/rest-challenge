import express, { Router } from 'express'
import { userRoutes } from './users.route'
import { postRoutes } from './posts.route'

const router = express.Router()

export function apiRouter(app: Router): Router {
  app.use('/accounts', userRoutes())
  app.use('/posts', postRoutes())

  return router
}
