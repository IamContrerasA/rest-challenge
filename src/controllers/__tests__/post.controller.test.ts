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

describe('test post controller happy way', () => {
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

  test('update specific post is valid', async () => {
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
        expect(jsonResult.success).toBe(true)
        return this
      },
    }
    await likedPost(req, res)
  })

  test('unlike specific post is valid', async () => {
    const req: any = {
      ...reqGlobal,
      body: { ...reqGlobal.body, liked: [1] },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(200)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.success).toBe(true)
        return this
      },
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
})

describe('test post controller error way', () => {
  test('create post with empty data is invalid', async () => {
    const req: any = {}

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(404)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.error).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await createPost(req, res)
  })

  test('find empty posts is invalid', async () => {
    const req: any = {}

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(404)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.error).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await findPosts(req, res)
  })

  test('find empty specific post is invalid', async () => {
    const req: any = { ...reqGlobal, params: { id: 100 } }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(404)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.error).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await findPost(req, res)
  })

  test('update empty specific post is invalid', async () => {
    const req: any = {
      ...reqGlobal,
      params: { id: 100 },
      body: { ...reqGlobal.body, title: 'updated title' },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(403)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.error).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await updatePost(req, res)
  })

  test('publish empty specific post is isvalid', async () => {
    const req: any = { ...reqGlobal, params: { id: 100 } }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(403)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.error).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await publishPost(req, res)
  })

  test('like empty specific post is invalid', async () => {
    const req: any = { ...reqGlobal, params: { id: 100 } }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(404)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.error).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await likedPost(req, res)
  })

  test('delete empty specific post is invalid', async () => {
    const req: any = { ...reqGlobal, params: { id: 100 } }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(403)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.error).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await deletePost(req, res)
  })
})
