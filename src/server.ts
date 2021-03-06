import path from 'path'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { apiRouter } from './router'
import { protect, signin, signup, verifyemail, signout } from './utils/auth'

const app = express()
const PORT = process.env.PORT || 3000
const ENVIROMENT = process.env.NODE_ENV || 'development'

app.use(express.json())
app.use(express.urlencoded())

function errorHandler(
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  if (ENVIROMENT !== 'development') {
    console.error('error ENVIROMENT !== development')
  }

  res.status(500)
}

app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/public/index.html'))
})
app.use(express.static(__dirname + '/public'))

app.post('/signup', signup)
app.post('/verify-account/:emailToken', verifyemail)
app.post('/signin', signin)
app.post('/signout', signout)

// Protected routes
app.put('/accounts/:id', protect)
app.delete('/accounts/:id', protect)
app.put('/accounts/:id/publicName', protect)
app.put('/accounts/:id/publicEmail', protect)
app.post('/posts', protect)
app.put('/posts/:id', protect)
app.delete('/posts/:id', protect)
app.put('/posts/:id/publish', protect)
app.put('/posts/:id/liked', protect)
app.post('/posts/:id/comments', protect)
app.put('/posts/:id/comments/:id', protect)
app.delete('/posts/:id/comments/:id', protect)
app.put('/posts/:id/comments/:id/publish', protect)
app.put('/posts/:id/comments/:id/liked', protect)

app.get('/api/v1/status', (req: Request, res: Response) => {
  res.json({ time: new Date() })
})
app.use('/', apiRouter(app))
app.use(errorHandler)

app.listen(PORT, async () => {
  console.log(`Server listening on port %d, env: %s`, PORT, ENVIROMENT)
})
