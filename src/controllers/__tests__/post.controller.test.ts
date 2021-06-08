/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma, signup } from '../../utils/auth'
import { createPost } from '../posts.controller'

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
