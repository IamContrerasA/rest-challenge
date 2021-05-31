import { Request, Response } from 'express'
import { errorPostUserIdDiff, prisma } from './app.controller'

export async function createPost(req: Request, res: Response): Promise<void> {
  const post = await prisma.post.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.user.id,
    },
  })
  res.status(200).json({ post: post })
}

export async function findPosts(req: Request, res: Response): Promise<void> {
  const allPosts = await prisma.post.findMany()
  res.status(200).json({ posts: allPosts })
}

export async function findPost(req: Request, res: Response): Promise<void> {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (!post) throw new Error(`Couldn't find post with id = '${req.params.id}'`)

  res.status(200).json({ post: post })
}

export async function updatePost(req: Request, res: Response): Promise<void> {
  await errorPostUserIdDiff(req, res)
  const postBody = { ...req.body }
  delete postBody.user

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: postBody,
    })
    res.status(200).json({ post: post })
  } catch (error) {
    throw new Error(`Couldn't find post with id = '${req.params.id}'`)
  }
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  await errorPostUserIdDiff(req, res)
  try {
    const post = await prisma.post.delete({
      where: { id: parseInt(req.params.id) },
    })

    res.status(200).json({ post: post })
  } catch (error) {
    throw new Error(`Couldn't find post with id = '${req.params.id}'`)
  }
}

export async function publishPost(req: Request, res: Response): Promise<void> {
  await errorPostUserIdDiff(req, res)
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: { published: true },
    })
    res.status(200).json({ post: post })
  } catch (error) {
    throw new Error(`Couldn't find post with id = '${req.params.id}'`)
  }
}

export async function likedPost(req: Request, res: Response): Promise<void> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        liked: true,
      },
    })
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
    res.status(200).json({ sucess: true })
  } catch (error) {
    throw new Error(`Couldn't find post with id = '${req.params.id}'`)
  }
}
