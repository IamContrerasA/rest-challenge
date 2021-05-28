import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function findUsers(req: Request, res: Response): Promise<void> {
  const allUsers = await prisma.user.findMany()
  res
    .status(200)
    .json({ messgae: `it works from controller! ${allUsers[0].firstname}` })
}

export async function createUser(req: Request, res: Response): Promise<void> {
  await await prisma.user.create({
    data: {
      firstname: 'Alice',
      email: 'alice@prisma.io',
    },
  })
  res.status(200).json({ messgae: `sucess! ` })
}
