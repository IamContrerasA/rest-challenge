import { Request, Response } from 'express'
import { errorUserIdDiff, prisma } from './app.controller'

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
  await errorUserIdDiff(req, res)
  const userBody = { ...req.body }
  delete userBody.user

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
  await errorUserIdDiff(req, res)
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    })

    res.status(200).json({ user: user })
  } catch (error) {
    throw new Error(`Couldn't find User with id = '${req.params.id}'`)
  }
}

export async function publicName(req: Request, res: Response): Promise<void> {
  await errorUserIdDiff(req, res)

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: {
        isNamePublic: !req.body.user.isNamePublic,
      },
    })
    res
      .status(200)
      .json({ user: { ...user, password: 'you know your password ;)' } })
  } catch (error) {
    throw new Error(`Couldn't find User with id = '${req.params.id}'`)
  }
}

export async function publicEmail(req: Request, res: Response): Promise<void> {
  await errorUserIdDiff(req, res)

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: {
        isEmailPublic: !req.body.user.isEmailPublic,
      },
    })
    res
      .status(200)
      .json({ user: { ...user, password: 'you know your password ;)' } })
  } catch (error) {
    throw new Error(`Couldn't find User with id = '${req.params.id}'`)
  }
}
