import jwt from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import sgMail from '@sendgrid/mail'

export const prisma = new PrismaClient()
const JWT_SECRET = `${process.env.JWT_SECRET}`

export const newToken = (user: User | null): string | Buffer => {
  return jwt.sign({ id: user?.id }, JWT_SECRET, {
    expiresIn: '100d',
  })
}

export const verifyToken = (token: string): string | Promise<unknown> =>
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
    bcrypt.hash(req.body.password, 8, async (err, hash) => {
      if (err) {
        return res.status(400).send({ message: 'error on password hash' })
      }
      try {
        const emailToken = (
          await bcrypt.hash(`${process.env.EMAIL_TOKEN}`, 4)
        ).replace(/\//g, 'a')
        const user = await prisma.user.create({
          data: {
            email: req.body.email,
            password: hash,
            emailToken: emailToken,
          },
        })

        if (process.env.NODE_ENV === 'development') {
          console.log(
            `Go to the next link please: ${process.env.URL}verify-account/${user.emailToken} with insomnia or postman because it use method:post`,
          )
        }
        if (process.env.NODE_ENV === 'production') {
          sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`)
          const msg = {
            to: `${user.email}`, // Change to your recipient
            from: 'iamcontrerasdev@gmail.com', // Change to your verified sender
            subject: 'Verify email please - Iam Assignment',
            text: `Go to the next link please: ${process.env.URL}verify-account/${user.emailToken} with insomnia or postman because it use method:post`,
            html: `<strong>Go to the next link please: ${process.env.URL}verify-account/${user.emailToken} with insomnia or postman because it use method:post</strong>`,
          }

          sgMail
            .send(msg)
            .then((response) => {
              console.log(response[0].statusCode)
              console.log(response[0].headers)
            })
            .catch((error) => {
              console.error(error)
            })
        }

        const token = newToken(user)
        res.status(201).send({ token })
      } catch (e) {
        res.status(400).send({ message: 'email already exists' })
      }
    })
  } catch (e) {
    return res.status(500).end()
  }
}

//checkpassword
function checkPassword(userPassord: string, password: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, userPassord, (err, same) => {
      if (err) {
        return reject(err)
      }
      resolve(same)
    })
  })
}

export async function signin(req: Request, res: Response): Promise<void> {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' }).end()
  }

  const invalid = 'Invalid email or passoword combination'

  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    })

    if (!user) {
      res.status(401).send({ message: `User not found` })
      return
    }

    const match = await checkPassword(user.password, req.body.password)

    if (!match) {
      res.status(401).send({ message: `${invalid}, User password dont match` })
    }

    if (user.status === 'PENDING')
      res.status(401).send({ message: `User email does not verified` })

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isLogged: true,
      },
    })

    const token = newToken(user)
    res.status(201).send({ token })
  } catch (e) {
    return res.status(500).end()
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
      isNamePublic: true,
      isEmailPublic: true,
      status: true, // pending, success
      emailToken: false, // a hash
      password: false,
      isLogged: true,
    },
  })
  if (!user) {
    return res.status(402).end()
  }
  if (user.status === 'PENDING') return res.status(402).end()
  if (!user.isLogged)
    return res.status(401).send({ message: `Please signin first` }).end()

  req.body.user = user
  next()
}

export const signout = async (req: Request, res: Response): Promise<void> => {
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

  const user = await prisma.user.update({
    where: { id: payload.id },
    data: {
      isLogged: false,
    },
  })
  if (!user) {
    return res.status(402).end()
  }

  if (!user.isLogged) res.status(201).send({ message: `user logout` })
}

export async function verifyemail(req: Request, res: Response): Promise<void> {
  const { emailToken } = req.params

  const user = await prisma.user.findUnique({
    where: { emailToken: emailToken },
  })

  if (!user) {
    res.status(401).send({ message: `User not found` })
    return
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'APPROVED', emailToken: `${user.id}EmailVerified` },
    })
    res.status(201).send({ message: 'Email verified!' })
  } catch (error) {
    return res.status(402).end()
  }
}
