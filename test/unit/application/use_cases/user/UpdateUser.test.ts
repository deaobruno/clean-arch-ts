import { faker } from "@faker-js/faker"
import { expect } from "chai"
import InMemoryDriver from "../../../../../src/infra/drivers/InMemoryDriver"
import UserRepository from "../../../../../src/adapters/repositories/UserRepository"
import { LevelEnum, User } from "../../../../../src/domain/User"
import { UpdateUser } from '../../../../../src/application/use_cases/user/UpdateUser'

const inMemoryDriver = new InMemoryDriver()
const userRepository = new UserRepository(inMemoryDriver)
const updateUser = new UpdateUser(userRepository)
const user_id = faker.datatype.uuid()
const userData = {
  user_id,
  email: faker.internet.email(),
  password: faker.internet.password(),
  level: LevelEnum.CUSTOMER
}

describe('/application/use_cases/user/UpdateUser.ts', () => {
  before(async () => await userRepository.save(User.create(userData)))

  it('should update an existing user', async () => {
    const newEmail = faker.internet.email()
    const updateData = {
      userId: user_id,
      email: newEmail,
    }
    const result = await updateUser.exec(updateData)

    expect(result.user_id).equal(user_id)
    expect(result.email).equal(newEmail)
    expect(result.password).equal(userData.password)
    expect(result.level).equal(userData.level)
  })

  it('should fail when trying to update an user passing wrong ID', async () => {
    await updateUser.exec({ userId: '' })
      .catch(error => {
        expect(error.message).equal('User not found')
      })
  })
})
