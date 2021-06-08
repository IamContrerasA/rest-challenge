/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma, signup } from '../../utils/auth'
import {
  createPost,
  deletePost,
  findPost,
  findPosts,
  likedPost,
  publishPost,
  updatePost,
} from '../posts.controller'

const reqGlobal = {
  params: { id: 1 },
  body: {
    title: 'title of fake post',
    content: 'content of fake post',
    user: {
      id: 1,
    },
  },
}

beforeAll(async () => {
  const req: any = {
    body: {
      email: 'myemail14@email.com',
      password: 'password14',
    },
  }

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(201)
      return this
    },
    send: () => this,
  }
  await signup(req, res)
})

afterAll(async () => {
  await prisma.$executeRaw(
    `TRUNCATE TABLE public."Comment" RESTART IDENTITY CASCADE;`,
  )
  await prisma.$executeRaw(
    `TRUNCATE TABLE public."Post" RESTART IDENTITY CASCADE;`,
  )
  await prisma.$executeRaw(
    `TRUNCATE TABLE public."User" RESTART IDENTITY CASCADE;`,
  )
  await prisma.$disconnect()
})

test('create post is valid', async () => {
  await new Promise((r) => setTimeout(r, 2000))

  const req: any = reqGlobal

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(200)
      return this
    },
    json: function (jsonResult: any) {
      expect(jsonResult.post.title).toBe('title of fake post')
      return this
    },
  }
  await createPost(req, res)
})

test('find post is valid', async () => {
  const req: any = reqGlobal

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(200)
      return this
    },
    json: function (jsonResult: any) {
      expect(jsonResult.posts[0].title).toBe('title of fake post')
      return this
    },
  }
  await findPosts(req, res)
})

test('find specific post is valid', async () => {
  const req: any = reqGlobal

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(200)
      return this
    },
    json: function (jsonResult: any) {
      expect(jsonResult.post.title).toBe('title of fake post')
      return this
    },
  }
  await findPost(req, res)
})

test('find specific post is valid', async () => {
  const req: any = {
    ...reqGlobal,
    body: { ...reqGlobal.body, title: 'updated title' },
  }

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(200)
      return this
    },
    json: function (jsonResult: any) {
      expect(jsonResult.post.title).toBe('updated title')
      return this
    },
  }
  await updatePost(req, res)
})

test('publish specific post is valid', async () => {
  const req: any = reqGlobal

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(200)
      return this
    },
    json: function (jsonResult: any) {
      expect(jsonResult.post.published).toBe(true)
      return this
    },
  }
  await publishPost(req, res)
})

test('like specific post is valid', async () => {
  const req: any = {
    ...reqGlobal,
    body: { ...reqGlobal.body, liked: [] },
  }

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(200)
      return this
    },
    json: function (jsonResult: any) {
      expect(jsonResult.post.liked[0]).toBe(1)
      return this
    },
    end: () => this,
  }
  await likedPost(req, res)
})

test('delete specific post is valid', async () => {
  const req: any = reqGlobal

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(200)
      return this
    },
    json: function (jsonResult: any) {
      expect(jsonResult.post.title).toBe('updated title')
      return this
    },
  }
  await deletePost(req, res)
})
