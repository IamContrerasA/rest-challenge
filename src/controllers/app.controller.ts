import { Request } from 'express'
import { prisma } from '../utils/auth'

export async function errorUserIdDiff(req: Request): Promise<boolean> {
  const { user } = req.body

  const existUser = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (user.id !== existUser?.id) {
    return true
  }
  return false
}

export async function errorPostUserIdDiff(req: Request): Promise<boolean> {
  const { user } = req.body

  const existPost = await prisma.post.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (user.id !== existPost?.authorId) {
    return true
  }
  return false
}

export async function errorCommentUserIdDiff(req: Request): Promise<boolean> {
  const { user } = req.body

  const existComment = await prisma.comment.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (user.id !== existComment?.authorId) {
    return true
  }
  return false
}
