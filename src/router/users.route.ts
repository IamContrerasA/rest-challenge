import express, { Router } from 'express'
import {
  findUsers,
  findUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller'

const router = express.Router()

export function userRoutes(): Router {
  router.route('/').get(findUsers)
  router.route('/:id').get(findUser)
  router.route('/:id').put(updateUser)
  router.route('/:id').delete(deleteUser)

  return router
}
