import { userRoutes } from '../users.route'

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
