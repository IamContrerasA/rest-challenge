/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma, signup } from '../../utils/auth'
import { findUser, findUsers } from '../users.controller'

let token: string

beforeAll(async () => {
  const req: any = {
    body: {
      email: 'myemail13@email.com',
      password: 'password13',
    },
  }

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(201)
      return this
    },
    send: function (sendResult: any) {
      token = sendResult.token
      return this
    },
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

test('find all users', async () => {
  await new Promise((r) => setTimeout(r, 2000))
  const req: any = {}

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(200)
      return this
    },
    json: function (jsonResult: any) {
      expect(jsonResult.users[0].email).toBe('myemail13@email.com')
      return this
    },
  }
  await findUsers(req, res)
})

test('find specific user', async () => {
  const req: any = { params: { id: 1 } }

  const res: any = {
    status: function (statusNumber: number) {
      expect(statusNumber).toBe(200)
      return this
    },
    json: function (jsonResult: any) {
      expect(jsonResult.user.id).toBe(1)
      return this
    },
    end: () => this,
  }
  await findUser(req, res)
})

test('token', async () => {
  console.log(token)
})
