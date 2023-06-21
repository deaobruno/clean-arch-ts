import { faker } from "@faker-js/faker"
import { expect } from "chai"
import InMemoryDriver from "../../../../../src/infra/drivers/InMemoryDriver"
import UserRepository from "../../../../../src/adapters/repositories/UserRepository"
import { LevelEnum, User } from "../../../../../src/domain/User"
import { UpdateUserPassword } from '../../../../../src/application/use_cases/user/UpdateUserPassword'

const inMemoryDriver = new InMemoryDriver()
const userRepository = new UserRepository(inMemoryDriver)
const updateUserPassword = new UpdateUserPassword(userRepository)
const user_id = faker.datatype.uuid()
const userData = {
  user_id,
  email: faker.internet.email(),
  password: faker.internet.password(),
  level: LevelEnum.CUSTOMER
}

describe('/application/use_cases/user/UpdateUserPassword.ts', () => {
  before(async () => await userRepository.save(User.create(userData)))

  it('should update the password of an existing user', async () => {
    const updateData = {
      userId: user_id,
      password: faker.internet.password(),
    }
    const result = await updateUserPassword.exec(updateData)

    expect(result.user_id).equal(userData.user_id)
    expect(result.email).equal(userData.email)
    expect(result.password).not.equal(userData.password)
    expect(result.level).equal(userData.level)
  })

  it('should fail when trying to update an user password passing wrong ID', async () => {
    await updateUserPassword.exec({ userId: '', password: '' })
      .catch(error => {
        expect(error.message).equal('User not found')
      })
  })
})
