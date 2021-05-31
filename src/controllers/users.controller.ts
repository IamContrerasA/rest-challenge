import { Request, Response } from 'express'
import { prisma } from './app.controller'

export async function findUsers(req: Request, res: Response): Promise<void> {
  const allUsers = await prisma.user.findMany()
  res.status(200).json({ users: allUsers })
}

export async function findUser(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (!user) throw new Error(`Couldn't find User with id = '${req.params.id}'`)

  res.status(200).json({ user: user })
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { user, ...userBody } = req.body

  const existUser = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (user.id !== existUser?.id) {
    res.status(200).json({ error: `author id is not the current user` })
    return
  }
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: userBody,
    })
    res
      .status(200)
      .json({ user: { ...user, password: 'you know your password ;)' } })
  } catch (error) {
    throw new Error(`Couldn't find User with id = '${req.params.id}'`)
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const existUser = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (req.body.user.id !== existUser?.id) {
    res.status(200).json({ error: `author id is not the current user` })
    return
  }
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    })

    res.status(200).json({ user: user })
  } catch (error) {
    throw new Error(`Couldn't find User with id = '${req.params.id}'`)
  }
}
