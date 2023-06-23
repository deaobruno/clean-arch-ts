import { expect } from 'chai'
import userRotes from '../../../../src/infra/http/userRoutes'
import BaseController from '../../../../src/adapters/controllers/BaseController'
import BaseMiddleware from '../../../../src/adapters/middlewares/BaseMiddleware'

class CustomController extends BaseController {}
class CustomMiddleware extends BaseMiddleware {}

const useCase = {
  exec: (data: any): Promise<void> => Promise.resolve(data)
}
const dependencies = {
  middlewares: {
    testMiddleware: new CustomMiddleware(useCase),
  },
  controllers: {
    createAdminController: new CustomController({ useCase }),
    findUsersController: new CustomController({ useCase }),
    findUserByIdController: new CustomController({ useCase }),
    updateUserController: new CustomController({ useCase }),
    updateUserPasswordController: new CustomController({ useCase }),
    deleteUserController: new CustomController({ useCase }),
  },
  presenters: {
    customerPresenter: {
      present: (data: any) => data
    },
    adminPresenter: {
      present: (data: any) => data
    },
  }
}

describe('/infra/http/userRoutes.ts', () => {
  it('should return an array of user routes', () => {
    userRotes(dependencies).map(route => {
      expect(route.path.split('/')[1]).equal('users')
      expect(['get', 'post', 'put', 'delete'].includes(route.method)).equal(true)
      expect([200, 201, 204].includes(route.statusCode)).equal(true)
    })
  })
})
