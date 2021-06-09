/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma, signup } from '../../utils/auth'
import {
  createComment,
  deleteComment,
  findComment,
  findComments,
  likedComment,
  publishComment,
  updateComment,
} from '../comments.controller'

const reqGlobal = {
  params: { id: 1 },
  body: {
    content: 'content of fake comment',
    user: {
      id: 1,
    },
  },
}

beforeAll(async () => {
  const req: any = {
    body: {
      email: 'myemail15@email.com',
      password: 'password15',
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
  await new Promise((r) => setTimeout(r, 500))
  await prisma.post.create({
    data: {
      title: 'fake title post',
      content: 'fake content post',
      authorId: 1,
    },
  })
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

describe('test comment controller happy way', () => {
  test('create comment is valid', async () => {
    await new Promise((r) => setTimeout(r, 2000))

    const req: any = reqGlobal

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(200)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.comment.content).toBe('content of fake comment')
        return this
      },
    }
    await createComment(req, res)
  })

  test('find comment is valid', async () => {
    const req: any = reqGlobal

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(200)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.comments[0].content).toBe('content of fake comment')
        return this
      },
    }
    await findComments(req, res)
  })

  test('find specific comment is valid', async () => {
    const req: any = reqGlobal

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(200)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.comment.content).toBe('content of fake comment')
        return this
      },
    }
    await findComment(req, res)
  })

  test('update specific comment is valid', async () => {
    const req: any = {
      ...reqGlobal,
      body: { ...reqGlobal.body, content: 'updated content' },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(200)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.comment.content).toBe('updated content')
        return this
      },
    }
    await updateComment(req, res)
  })

  test('publish specific comment is valid', async () => {
    const req: any = reqGlobal

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(200)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.comment.published).toBe(true)
        return this
      },
    }
    await publishComment(req, res)
  })

  test('like specific comment is valid', async () => {
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
    await likedComment(req, res)
  })

  test('unlike specific comment is valid', async () => {
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
    await likedComment(req, res)
  })

  test('delete specific comment is valid', async () => {
    const req: any = reqGlobal

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(200)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.comment.content).toBe('updated content')
        return this
      },
    }
    await deleteComment(req, res)
  })
})

describe('test comment controller error way', () => {
  test('create comment with empty data is invalid', async () => {
    const req: any = { params: { id: 1 } }

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
    await createComment(req, res)
  })

  test('find empty comments is invalid', async () => {
    const req: any = { params: { id: 1 } }

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
    await findComments(req, res)
  })

  test('find empty specific comment is invalid', async () => {
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
    await findComment(req, res)
  })

  test('update empty specific comment is invalid', async () => {
    const req: any = {
      ...reqGlobal,
      params: { id: 100 },
      body: { ...reqGlobal.body, content: 'updated content' },
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
    await updateComment(req, res)
  })

  test('publish empty specific comment is isvalid', async () => {
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
    await publishComment(req, res)
  })

  test('like empty specific comment is invalid', async () => {
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
    await likedComment(req, res)
  })

  test('delete empty specific comment is invalid', async () => {
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
    await deleteComment(req, res)
  })
})
