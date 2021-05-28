import express, { Router } from 'express'
import {
  createPost,
  findPosts,
  findPost,
  updatePost,
  deletePost,
} from '../controllers/posts.controller'

const router = express.Router()

export function postRoutes(): Router {
  router.route('/').post(createPost)
  router.route('/').get(findPosts)
  router.route('/:id').get(findPost)
  router.route('/:id').put(updatePost)
  router.route('/:id').delete(deletePost)

  return router
}
