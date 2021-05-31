import express, { Router } from 'express'
import {
  createPost,
  findPosts,
  findPost,
  updatePost,
  deletePost,
  publishPost,
  likedPost,
} from '../controllers/posts.controller'

const router = express.Router()

export function postRoutes(): Router {
  router.route('/').post(createPost)
  router.route('/').get(findPosts)
  router.route('/:id').get(findPost)
  router.route('/:id').put(updatePost)
  router.route('/:id').delete(deletePost)
  router.route('/:id/publish').put(publishPost)
  router.route('/:id/liked').put(likedPost)

  return router
}
