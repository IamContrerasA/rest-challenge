/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma, protect, signin, signup } from '../../utils/auth'

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
        token = sendResult.token
        return this
      },
    }
    await protect(req, res, jest.fn())
  })
})
