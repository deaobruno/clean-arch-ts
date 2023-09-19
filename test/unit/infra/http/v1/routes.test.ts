import { expect } from 'chai'
import dependencies  from '../../../../../src/dependencies'
import config  from '../../../../../src/config'
import routes from '../../../../../src/infra/http/v1/routes'

describe('/infra/http/routes.ts', () => {
  it('should return an array of routes', () => {
    routes(dependencies(config)).forEach(route => {
      expect(['auth', 'users'].includes(route.path.split('/')[1])).equal(true)
      expect(['get', 'post', 'put', 'delete'].includes(route.method)).equal(true)
      expect([200, 201, 204].includes(route.statusCode)).equal(true)
    })
  })
})
