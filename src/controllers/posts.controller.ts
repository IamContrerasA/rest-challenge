import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

  if (!post) throw new Error(`Couldn't find Post with id = '${req.params.id}'`)

  res.status(200).json({ post: post })
}

export async function updatePost(req: Request, res: Response): Promise<void> {
  const { user, ...postBody } = req.body

  const existPost = await prisma.post.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (user.id !== existPost?.authorId) {
    res.status(200).json({ error: `author id is not the current user` })
    return
  }
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
  const existPost = await prisma.post.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (req.body.user.id !== existPost?.authorId) {
    res.status(200).json({ error: `author id is not the current user` })
    return
  }
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    })

    res.status(200).json({ user: user })
  } catch (error) {
    throw new Error(`Couldn't find User with id = '${req.params.id}'`)
  }
}
