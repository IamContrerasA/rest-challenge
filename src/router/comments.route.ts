import express, { Router } from 'express'
import {
  createComment,
  findComments,
  findComment,
  updateComment,
  deleteComment,
  publishComment,
  likedComment,
} from '../controllers/comments.controller'

const router = express.Router({ mergeParams: true })

export function commentRoutes(): Router {
  router.route('/').post(createComment)
  router.route('/').get(findComments)
  router.route('/:id').get(findComment)
  router.route('/:id').put(updateComment)
  router.route('/:id').delete(deleteComment)
  router.route('/:id/publish').put(publishComment)
  router.route('/:id/liked').put(likedComment)

  return router
}
