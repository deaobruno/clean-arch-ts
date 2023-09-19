import { expect } from 'chai'
import dependencies  from '../../../../../src/dependencies'
import config  from '../../../../../src/config'
import httpRoutes from '../../../../../src/infra/http/v1/routes'

describe('/infra/http/routes.ts', () => {
  it('should return an array of routes', () => {
    const dependenciesContainer = dependencies(config)
    const routes = httpRoutes(dependenciesContainer)

    expect(routes.length).equal(Object.keys(dependenciesContainer.controllers).length)
  })
})
