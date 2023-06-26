import { expect } from 'chai'
import routes from '../../../../src/infra/http/routes'

describe('/infra/http/routes.ts', () => {
  it('should return an array of routes', () => {
    routes.map(route => {
      expect(['auth', 'users'].includes(route.path.split('/')[1])).equal(true)
      expect(['get', 'post', 'put', 'delete'].includes(route.method)).equal(true)
      expect([200, 201, 204].includes(route.statusCode)).equal(true)
    })
  })
})
