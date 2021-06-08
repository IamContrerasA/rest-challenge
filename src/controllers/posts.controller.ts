import { Request, Response } from 'express'
import { prisma } from '../utils/auth'
import { errorPostUserIdDiff } from './app.controller'

export async function createPost(req: Request, res: Response): Promise<void> {
  try {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        authorId: req.body.user.id,
      },
    })
    res.status(200).json({ post: post })
  } catch (error) {
    return res.status(404).json({ error: `Couldn't create a post` }).end()
  }
}

export async function findPosts(req: Request, res: Response): Promise<void> {
  const allPosts = await prisma.post.findMany()

  if (!allPosts)
    return res.status(404).json({ error: `Couldn't find any posts jet ` }).end()

  res.status(200).json({ posts: allPosts })
}

export async function findPost(req: Request, res: Response): Promise<void> {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (!post)
    return res
      .status(404)
      .json({ error: `Couldn't find pos with id = '${req.params.id}'` })
      .end()

  res.status(200).json({ post: post })
}

export async function updatePost(req: Request, res: Response): Promise<void> {
  const permissionError = await errorPostUserIdDiff(req)
  if (permissionError)
    return res
      .status(403)
      .json({
        error: `Current user cannot edit the information of another user, only that of him`,
      })
      .end()

  const postBody = { ...req.body }
  delete postBody.user

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: postBody,
    })
    res.status(200).json({ post: post })
  } catch (error) {
    return res
      .status(404)
      .json({ error: `Couldn't find pos with id = '${req.params.id}'` })
      .end()
  }
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  const permissionError = await errorPostUserIdDiff(req)
  if (permissionError)
    return res
      .status(403)
      .json({
        error: `Current user cannot edit the information of another user, only that of him`,
      })
      .end()
  try {
    const post = await prisma.post.delete({
      where: { id: parseInt(req.params.id) },
    })

    res.status(200).json({ post: post })
  } catch (error) {
    return res
      .status(404)
      .json({ error: `Couldn't find pos with id = '${req.params.id}'` })
      .end()
  }
}

export async function publishPost(req: Request, res: Response): Promise<void> {
  const permissionError = await errorPostUserIdDiff(req)
  if (permissionError)
    return res
      .status(403)
      .json({
        error: `Current user cannot edit the information of another user, only that of him`,
      })
      .end()
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: { published: true },
    })
    res.status(200).json({ post: post })
  } catch (error) {
    return res
      .status(404)
      .json({ error: `Couldn't find pos with id = '${req.params.id}'` })
      .end()
  }
}

export async function likedPost(req: Request, res: Response): Promise<void> {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    select: {
      liked: true,
    },
  })

  if (!post)
    return res
      .status(404)
      .json({ error: `Couldn't find pos with id = '${req.params.id}'` })
      .end()

  const likedIndex = post?.liked.findIndex(
    (userId) => userId === req.body.user.id,
  )

  if (likedIndex === undefined || likedIndex < 0) {
    await prisma.post.update({
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
    const likedArray = post ? [...post?.liked] : []
    likedArray.splice(likedIndex, 1)

    await prisma.post.update({
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
