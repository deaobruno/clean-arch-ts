import { expect } from 'chai'
import dependencies  from '../../../../../src/dependencies'
import config  from '../../../../../src/config'
import httpRoutes from '../../../../../src/infra/http/v1/routes/routes'
import ServerDriverMock from '../../../../mocks/drivers/ServerDriverMock'

describe('/infra/http/routes.ts', () => {
  it('should return an array of routes', () => {
    const dependenciesContainer = dependencies(config)
    const routes = httpRoutes(dependenciesContainer, ServerDriverMock)

    expect(routes).equal(undefined)
  })
})
