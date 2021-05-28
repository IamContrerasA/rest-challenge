import jwt from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const JWT_SECRET = 'JWT_SECRET'

export const newToken = (user: User | null) => {
  return jwt.sign({ id: user?.id }, JWT_SECRET, {
    expiresIn: '100d',
  })
}

export const verifyToken = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ message: 'need email and password' })
  }

  try {
    let user: User
    bcrypt.hash(req.body.password, 8, async (err, hash) => {
      if (err) {
        throw new Error(`There is an error on hash password ${err}`)
      }
      user = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hash,
        },
      })
    })

    const token = newToken(user!)
    res.status(201).send({ token })
  } catch (e) {
    return res.status(500).end()
  }
}

//checkpassword
function checkPassword(userPassord: string, password: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, userPassord, (err, same) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      resolve(same)
    })
  })
}

export async function signin(req: Request, res: Response): Promise<void> {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ message: 'need email and password' })
  }

  const invalid = 'Invalid email and passoword combination'

  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    })

    if (!user) {
      res.status(401).send({ message: `${invalid}, no user found` })
    }

    const match = await checkPassword(user!.password, req.body.password)

    if (!match) {
      res.status(401).send({ message: `${invalid}, password dont match` })
    }

    const token = newToken(user)
    res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end()
  }

  const token = bearer.split('Bearer ')[1].trim()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).end()
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      firstname: true,
      surname: true,
      email: true,
      password: false,
    },
  })
  if (!user) {
    return res.status(401).end()
  }

  req.body.user = user
  next()
}
