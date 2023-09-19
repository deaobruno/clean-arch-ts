import { expect } from 'chai'
import authRotes from '../../../../../src/infra/http/v1/authRoutes'
import BaseController from '../../../../../src/adapters/controllers/BaseController'
import ServerDriverMock from '../../../../mocks/drivers/ServerDriverMock'

class CustomController extends BaseController {
  statusCode = 200
}

const useCase = {
  exec: (data: any): Promise<void> => Promise.resolve(data)
}
const dependencies = {
  drivers: {
    httpServerDriver: ServerDriverMock,
  },
  controllers: {
    registerCustomerController: new CustomController({ useCase }),
    authenticateUserController: new CustomController({ useCase }),
    refreshAccessTokenController: new CustomController({ useCase }),
    logoutController: new CustomController({ useCase }),
  },
}

describe('/infra/http/authRoutes.ts', () => {
  it('should return an array of auth routes', () => {
    const routes = authRotes(dependencies)

    expect(routes.length).equal(Object.keys(dependencies.controllers).length)
  })
})
