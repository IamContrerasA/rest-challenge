import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function errorPostUserIdDiff(
  req: Request,
  res: Response,
): Promise<void> {
  const { user } = req.body

  const existPost = await prisma.post.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (user.id !== existPost?.authorId) {
    res.status(200).json({ error: `author id is not the current user` })
    return
  }
}

export async function errorCommentUserIdDiff(
  req: Request,
  res: Response,
): Promise<void> {
  const { user } = req.body

  const existComment = await prisma.comment.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (user.id !== existComment?.authorId) {
    res.status(200).json({ error: `author id is not the current user` })
    return
  }
}
