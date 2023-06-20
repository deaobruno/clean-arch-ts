import { faker } from "@faker-js/faker"
import { expect } from "chai"
import InMemoryDriver from "../../../../../src/infra/drivers/InMemoryDriver"
import UserRepository from "../../../../../src/adapters/repositories/UserRepository"
import { LevelEnum, User } from "../../../../../src/domain/User"
import DeleteUser from '../../../../../src/application/use_cases/user/DeleteUser'

const inMemoryDriver = new InMemoryDriver()
const userRepository = new UserRepository(inMemoryDriver)
const deleteUser = new DeleteUser(userRepository)
const user_id = faker.datatype.uuid()
const userData = {
  user_id,
  email: faker.internet.email(),
  password: faker.internet.password(),
  level: LevelEnum.CUSTOMER
}

describe('/application/use_cases/user/DeleteUser.ts', () => {
  before(async () => await userRepository.save(User.create(userData)))

  it('should delete an existing user',async () => {
    const result = await deleteUser.exec({ userId: user_id })

    expect(result).equal(undefined)
  })

  it('should fail when trying to update an user password passing wrong ID', async () => {
    await deleteUser.exec({ userId: '' })
      .catch(error => {
        expect(error.message).equal('User not found')
      })
  })
})
