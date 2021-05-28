import express, { Router } from 'express'
import { findUsers, createUser } from '../controllers/users.controller'

const router = express.Router()

export function userRoutes(): Router {
  router.route('/').get(findUsers)
  router.route('/').post(createUser)

  return router
}
