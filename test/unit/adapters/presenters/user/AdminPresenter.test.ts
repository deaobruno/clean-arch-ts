import { faker } from '@faker-js/faker'
import { User, LevelEnum } from '../../../../../src/domain/User'
import AdminPresenter from '../../../../../src/adapters/presenters/user/AdminPresenter'
import { expect } from 'chai'

const adminPresenter = new AdminPresenter()

describe('/application/presenters/user/AdminPresenter.ts', () => {
  it('should return an external representation of an admin user object', () => {
    const userData = {
      user_id: faker.datatype.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: LevelEnum.ADMIN
    }
    const user = User.create(userData)
    const admin = adminPresenter.present(user)

    expect(admin.id).equal(userData.user_id)
    expect(admin.email).equal(userData.email)
    expect(admin.level).equal(LevelEnum[userData.level])
  })
})
