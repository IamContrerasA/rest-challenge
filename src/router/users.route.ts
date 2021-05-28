import express, { Router } from 'express'
import {
  createUser,
  findUsers,
  findUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller'

const router = express.Router()

export function userRoutes(): Router {
  router.route('/').post(createUser)
  router.route('/').get(findUsers)
  router.route('/:id').get(findUser)
  router.route('/:id').put(updateUser)
  router.route('/:id').delete(deleteUser)

  return router
}
