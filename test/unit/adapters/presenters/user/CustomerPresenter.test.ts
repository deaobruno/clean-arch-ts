import { faker } from '@faker-js/faker'
import { User, LevelEnum } from '../../../../../src/domain/User'
import CustomerPresenter from '../../../../../src/adapters/presenters/user/CustomerPresenter'
import { expect } from 'chai'

const customerPresenter = new CustomerPresenter()

describe('/application/presenters/user/CustomerPresenter.ts', () => {
  it('should return an external representation of a customer user object', () => {
    const userData = {
      user_id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: LevelEnum.CUSTOMER
    }
    const user = User.create(userData)
    const customer = customerPresenter.present(user)

    expect(customer.id).equal(userData.user_id)
    expect(customer.email).equal(userData.email)
  })
})
