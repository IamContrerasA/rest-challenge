/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma, signup } from '../../utils/auth'
import {
  deleteUser,
  findUser,
  findUsers,
  publicEmail,
  publicName,
  updateUser,
} from '../users.controller'

let token: string
// test('token', async () => {
//   console.log(token)
// })
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

describe('test user controller happy way', () => {
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

  test('update specific user', async () => {
    const req: any = {
      params: { id: 1 },
      body: { firstname: 'nombre', user: { id: 1 } },
    }

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
    await updateUser(req, res)
  })

  test('set public name to specific user', async () => {
    const req: any = {
      params: { id: 1 },
      body: { isNamePublic: false, user: { id: 1 } },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(200)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.user.isNamePublic).toBe(true)
        return this
      },
      end: () => this,
    }
    await publicName(req, res)
  })

  test('set public email to specific user', async () => {
    const req: any = {
      params: { id: 1 },
      body: { isEmailPublic: false, user: { id: 1 } },
    }

    const res: any = {
      status: function (statusNumber: number) {
        expect(statusNumber).toBe(200)
        return this
      },
      json: function (jsonResult: any) {
        expect(jsonResult.user.isEmailPublic).toBe(true)
        return this
      },
      end: () => this,
    }
    await publicEmail(req, res)
  })

  test('delete specific user', async () => {
    const req: any = {
      params: { id: 1 },
      body: { user: { id: 1 } },
    }

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
    await deleteUser(req, res)
  })
})

describe('test user controller happy way', () => {
  test('find all users without users is invalid', async () => {
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
    await findUsers(req, res)
  })

  test('find empty user is invalid', async () => {
    const req: any = { params: { id: 100 } }

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
    await findUser(req, res)
  })

  test('update empty user is invalid', async () => {
    const req: any = {
      params: { id: 100 },
      body: { firstname: 'nombre', user: { id: 100 } },
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
    await updateUser(req, res)
  })

  test('set public name to empty user is invalid', async () => {
    const req: any = {
      params: { id: 100 },
      body: { isNamePublic: false, user: { id: 100 } },
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
    await publicName(req, res)
  })

  test('set public email to empty user is invalid', async () => {
    const req: any = {
      params: { id: 100 },
      body: { isEmailPublic: false, user: { id: 100 } },
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
    await publicEmail(req, res)
  })

  test('delete empty user is invalid', async () => {
    const req: any = {
      params: { id: 1 },
      body: { user: { id: 1 } },
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
    await deleteUser(req, res)
  })
})
