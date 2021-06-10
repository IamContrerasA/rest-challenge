/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma, protect, signin, signup, verifyemail } from '../../utils/auth'

let token: string

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

describe('auth happy way', () => {
  test('signup with correct values is valid', async () => {
    const req: any = {
      body: {
        email: 'myemail16@email.com',
        password: 'password16',
      },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(201)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult.token.length).toBe(137)
        return this
      },
    }
    await signup(req, res)
  })

  test('verify email with correct values is valid', async () => {
    await new Promise((r) => setTimeout(r, 500))
    await prisma.user.update({
      where: { id: 1 },
      data: { emailToken: 'faketoken' },
    })
    await new Promise((r) => setTimeout(r, 500))
    const req: any = {
      params: {
        emailToken: 'faketoken',
      },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(201)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult.message).toMatchSnapshot()
        return this
      },
    }
    await verifyemail(req, res)
  })

  test('signin with correct values is valid', async () => {
    await new Promise((r) => setTimeout(r, 500))
    const req: any = {
      body: {
        email: 'myemail16@email.com',
        password: 'password16',
      },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(201)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult.token.length).toBe(137)
        token = sendResult.token
        return this
      },
    }
    await signin(req, res)
  })

  test('protect with correct values is valid', async () => {
    const req: any = {
      body: {},
      headers: { authorization: `Bearer ${token}` },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(200)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult.user.id).toBe(1)
        return this
      },
    }
    await protect(req, res, jest.fn())
  })
})

describe('auth error way', () => {
  test('signup with incorrect values is invalid', async () => {
    const req: any = { body: {} }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(400)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult.message).toMatchSnapshot()
        return this
      },
    }
    await signup(req, res)
  })

  test('signup with email already exist is invalid', async () => {
    const req: any = {
      body: {
        email: 'myemail16@email.com',
        password: 'password16',
      },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(400)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult.message).toMatchSnapshot()
        return this
      },
    }
    await signup(req, res)
  })

  test('signin with incorrect values is invalid', async () => {
    const req: any = {
      body: {
        email: 'invalid@email.com',
        password: 'invalid',
      },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(500)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult.message).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await signin(req, res)
  })

  test('signin without email or password  is invalid', async () => {
    const req: any = {
      body: {
        email: undefined,
        password: undefined,
      },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(400)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult.message).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await signin(req, res)
  })

  test('protect with incorrect values is invalid', async () => {
    const req: any = {
      body: {},
      headers: { authorization: `Bearer faketoken` },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(401)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await protect(req, res, jest.fn())
  })

  test('protect without  values is invalid', async () => {
    const req: any = {
      body: {},
      headers: { authorization: '' },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(401)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult).toMatchSnapshot()
        return this
      },
      end: () => this,
    }
    await protect(req, res, jest.fn())
  })

  test('verify email with incorrect values is invalid', async () => {
    const req: any = {
      params: {
        emailToken: 'faketoken',
      },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(401)
        return this
      },
      send: function (sendResult: any) {
        expect(sendResult.message).toMatchSnapshot()
        return this
      },
    }
    await verifyemail(req, res)
  })
})
