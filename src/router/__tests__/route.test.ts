import { userRoutes } from '../users.route'
import { postRoutes } from '../posts.route'
import { commentRoutes } from '../comments.route'
import { apiRouter } from '../index'

test('has user crud routes', () => {
  const routes = [
    { path: '/', method: 'get' },
    { path: '/:id', method: 'get' },
    { path: '/:id', method: 'put' },
    { path: '/:id', method: 'delete' },
    { path: '/:id/publicName', method: 'put' },
    { path: '/:id/publicEmail', method: 'put' },
  ]

  routes.forEach((route) => {
    const match = userRoutes().stack.find(
      (s) => s.route.path === route.path && s.route.methods[route.method],
    )
    expect(match).toBeTruthy()
  })
})

test('has posts crud routes', () => {
  const routes = [
    { path: '/', method: 'post' },
    { path: '/', method: 'get' },
    { path: '/:id', method: 'get' },
    { path: '/:id', method: 'put' },
    { path: '/:id', method: 'delete' },
    { path: '/:id/publish', method: 'put' },
    { path: '/:id/liked', method: 'put' },
  ]

  routes.forEach((route) => {
    const match = postRoutes().stack.find(
      (s) => s.route.path === route.path && s.route.methods[route.method],
    )
    expect(match).toBeTruthy()
  })
})

test('has comments crud routes', () => {
  const routes = [
    { path: '/', method: 'post' },
    { path: '/', method: 'get' },
    { path: '/:id', method: 'get' },
    { path: '/:id', method: 'put' },
    { path: '/:id', method: 'delete' },
    { path: '/:id/publish', method: 'put' },
    { path: '/:id/liked', method: 'put' },
  ]

  routes.forEach((route) => {
    const match = commentRoutes().stack.find(
      (s) => s.route.path === route.path && s.route.methods[route.method],
    )
    expect(match).toBeTruthy()
  })
})

test('has index crud routes', () => {
  // need fix this test
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const app: any = { use: jest.fn() }
  expect(apiRouter(app)).toMatchInlineSnapshot(`[Function]`)
})
