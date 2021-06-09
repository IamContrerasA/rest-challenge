import { Request, Response } from 'express'
import { prisma } from '../utils/auth'
import { errorCommentUserIdDiff } from './app.controller'

export async function createComment(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        postId: parseInt(req.params.id),
        authorId: req.body.user.id,
      },
    })
    res.status(200).json({ comment: comment })
  } catch (error) {
    return res
      .status(404)
      .json({ error: `Couldn't find comment with id = '${req.params.id}'` })
      .end()
  }
}

export async function findComments(req: Request, res: Response): Promise<void> {
  const allComments = await prisma.comment.findMany({
    where: { postId: parseInt(req.params.id) },
  })

  if (!allComments.length)
    return res
      .status(404)
      .json({
        error: `Couldn't find comments with post id = '${req.params.id}'`,
      })
      .end()

  res.status(200).json({ comments: allComments })
}

export async function findComment(req: Request, res: Response): Promise<void> {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (!comment)
    return res
      .status(404)
      .json({ error: `Couldn't find comment with id = '${req.params.id}'` })
      .end()

  res.status(200).json({ comment: comment })
}

export async function updateComment(
  req: Request,
  res: Response,
): Promise<void> {
  const permissionError = await errorCommentUserIdDiff(req)
  if (permissionError)
    return res
      .status(403)
      .json({
        error: `Current user cannot edit the information of another user, only that of him`,
      })
      .end()
  const commentBody = { ...req.body }
  delete commentBody.user

  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: commentBody,
    })
    res.status(200).json({ comment: comment })
  } catch (error) {
    return res
      .status(404)
      .json({ error: `Couldn't find comment with id = '${req.params.id}'` })
      .end()
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
): Promise<void> {
  const permissionError = await errorCommentUserIdDiff(req)
  if (permissionError)
    return res
      .status(403)
      .json({
        error: `Current user cannot edit the information of another user, only that of him`,
      })
      .end()
  try {
    const comment = await prisma.comment.delete({
      where: { id: parseInt(req.params.id) },
    })

    res.status(200).json({ comment: comment })
  } catch (error) {
    return res
      .status(404)
      .json({ error: `Couldn't find comment with id = '${req.params.id}'` })
      .end()
  }
}

export async function publishComment(
  req: Request,
  res: Response,
): Promise<void> {
  const permissionError = await errorCommentUserIdDiff(req)
  if (permissionError)
    return res
      .status(403)
      .json({
        error: `Current user cannot edit the information of another user, only that of him`,
      })
      .end()
  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: { published: true },
    })
    res.status(200).json({ comment: comment })
  } catch (error) {
    return res
      .status(404)
      .json({ error: `Couldn't find comment with id = '${req.params.id}'` })
      .end()
  }
}

export async function likedComment(req: Request, res: Response): Promise<void> {
  const comment = await prisma.comment.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    select: {
      liked: true,
    },
  })

  if (!comment)
    return res
      .status(404)
      .json({ error: `Couldn't find comment with id = '${req.params.id}'` })
      .end()

  const likedIndex = comment?.liked.findIndex(
    (userId) => userId === req.body.user.id,
  )

  if (likedIndex === undefined || likedIndex < 0) {
    await prisma.comment.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        liked: {
          push: req.body.user.id,
        },
      },
    })
  } else {
    const likedArray = comment ? [...comment?.liked] : []
    likedArray.splice(likedIndex, 1)

    await prisma.comment.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        liked: {
          set: likedArray,
        },
      },
    })
  }
  res.status(200).json({ success: true })
}
