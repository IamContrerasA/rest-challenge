import { Request, Response } from 'express'
import { errorUserIdDiff, prisma } from './app.controller'

export async function findUsers(req: Request, res: Response): Promise<void> {
  const allUsers = await prisma.user.findMany()
  res.status(200).json({ users: allUsers })

  if (!allUsers)
    return res.status(404).json({ error: `Couldn't find any users jet ` }).end()
}

export async function findUser(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (!user) {
    return res
      .status(404)
      .json({ error: `Couldn't find User with id = '${req.params.id}'` })
      .end()
  }

  res.status(200).json({ user: user })
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const permissionError = await errorUserIdDiff(req)
  if (permissionError)
    return res
      .status(403)
      .json({
        error: `Current user cannot edit the information of another user, only that of him`,
      })
      .end()

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
    return res
      .status(404)
      .json({ error: `Couldn't find User with id = '${req.params.id}'` })
      .end()
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const permissionError = await errorUserIdDiff(req)
  if (permissionError)
    return res
      .status(403)
      .json({
        error: `Current user cannot edit the information of another user, only that of him`,
      })
      .end()

  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    })

    res.status(200).json({ user: user })
  } catch (error) {
    return res
      .status(404)
      .json({ error: `Couldn't find User with id = '${req.params.id}'` })
      .end()
  }
}

export async function publicName(req: Request, res: Response): Promise<void> {
  const permissionError = await errorUserIdDiff(req)
  if (permissionError)
    return res
      .status(403)
      .json({
        error: `Current user cannot edit the information of another user, only that of him`,
      })
      .end()

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
    return res
      .status(404)
      .json({ error: `Couldn't find User with id = '${req.params.id}'` })
      .end()
  }
}

export async function publicEmail(req: Request, res: Response): Promise<void> {
  const permissionError = await errorUserIdDiff(req)
  if (permissionError)
    return res
      .status(403)
      .json({
        error: `Current user cannot edit the information of another user, only that of him`,
      })
      .end()

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
    return res
      .status(404)
      .json({ error: `Couldn't find User with id = '${req.params.id}'` })
      .end()
  }
}
