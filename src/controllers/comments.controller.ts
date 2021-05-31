import { Request, Response } from 'express'
import { errorCommentUserIdDiff, prisma } from './app.controller'

export async function createComment(
  req: Request,
  res: Response,
): Promise<void> {
  const comment = await prisma.comment.create({
    data: {
      content: req.body.content,
      postId: parseInt(req.params.id),
      authorId: req.body.user.id,
    },
  })
  res.status(200).json({ comment: comment })
}

export async function findComments(req: Request, res: Response): Promise<void> {
  const allComments = await prisma.comment.findMany({
    where: { postId: parseInt(req.params.id) },
  })
  res.status(200).json({ comments: allComments })
}

export async function findComment(req: Request, res: Response): Promise<void> {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (!comment)
    throw new Error(`Couldn't find post with id = '${req.params.id}'`)

  res.status(200).json({ comment: comment })
}

export async function updateComment(
  req: Request,
  res: Response,
): Promise<void> {
  await errorCommentUserIdDiff(req, res)
  const commentBody = { ...req.body }
  delete commentBody.user

  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: commentBody,
    })
    res.status(200).json({ comment: comment })
  } catch (error) {
    throw new Error(`Couldn't find comment with id = '${req.params.id}'`)
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
): Promise<void> {
  await errorCommentUserIdDiff(req, res)
  try {
    const comment = await prisma.comment.delete({
      where: { id: parseInt(req.params.id) },
    })

    res.status(200).json({ comment: comment })
  } catch (error) {
    throw new Error(`Couldn't find comment with id = '${req.params.id}'`)
  }
}

export async function publishComment(
  req: Request,
  res: Response,
): Promise<void> {
  await errorCommentUserIdDiff(req, res)
  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: { published: true },
    })
    res.status(200).json({ comment: comment })
  } catch (error) {
    throw new Error(`Couldn't find comment with id = '${req.params.id}'`)
  }
}
