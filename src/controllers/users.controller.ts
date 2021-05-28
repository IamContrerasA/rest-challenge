import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createUser(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.create({
    data: req.body,
  })
  res.status(200).json({ user: user })
}

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
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.body.id) },
      data: req.body,
    })
    res.status(200).json({ user: user })
  } catch (error) {
    throw new Error(`Couldn't find User with id = '${req.body.id}'`)
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    })

    res.status(200).json({ user: user })
  } catch (error) {
    throw new Error(`Couldn't find User with id = '${req.params.id}'`)
  }
}
