import { expect } from 'chai'
import userRotes from '../../../../../src/infra/http/v1/userRoutes'
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
    createAdminController: new CustomController({ useCase }),
    findUsersController: new CustomController({ useCase }),
    findUserByIdController: new CustomController({ useCase }),
    updateUserController: new CustomController({ useCase }),
    updateUserPasswordController: new CustomController({ useCase }),
    deleteUserController: new CustomController({ useCase }),
  },
}

describe('/infra/http/userRoutes.ts', () => {
  it('should return an array of user routes', () => {
    const routes = userRotes(dependencies)

    expect(routes.length).equal(Object.keys(dependencies.controllers).length)
  })
})
