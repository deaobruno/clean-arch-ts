import { expect } from 'chai'
import authRotes from '../../../../../src/infra/http/v1/routes/authRoutes'
import BaseController from '../../../../../src/adapters/controllers/BaseController'

class CustomController extends BaseController {}

const useCase = {
  exec: (data: any): Promise<void> => Promise.resolve(data)
}
const dependencies = {
  controllers: {
    registerController: new CustomController({ useCase }),
  },
  presenters: {
    customerPresenter: {
      present: (data: any) => data
    },
  }
}

describe('/infra/http/authRoutes.ts', () => {
  it('should return an array of auth routes', () => {
    authRotes(dependencies).forEach(route => {
      expect(route.path.split('/')[1]).equal('auth')
      expect(['get', 'post', 'put', 'delete'].includes(route.method)).equal(true)
      expect([200, 201, 204].includes(route.statusCode)).equal(true)
    })
  })
})
