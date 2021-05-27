import express, { Router } from 'express'

const router = express.Router()

export function userRoutes(): Router {
  router.route('/').get((req, res) => {
    res.status(200).json({ message: 'it works' })
  })

  return router
}
