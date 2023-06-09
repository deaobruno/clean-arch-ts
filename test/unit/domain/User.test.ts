import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import { LevelEnum, User } from '../../../src/domain/User'

const user_id = faker.string.uuid()
const email = faker.internet.email()
const password = faker.internet.password()

describe('/domain/User.ts', () => {
  it('should create a root User entity object', () => {
    const userParams = {
      user_id,
      email,
      password,
      level: 0
    }
    const user = User.create(userParams)

    expect(user.user_id).equal(userParams.user_id)
    expect(user.email).equal(userParams.email)
    expect(user.password).equal(userParams.password)
    expect(user.level).equal(LevelEnum.ROOT)
    expect(user.isRoot).equal(true)
  })

  it('should create an admin User entity object', () => {
    const userParams = {
      user_id,
      email,
      password,
      level: 1
    }
    const user = User.create(userParams)

    expect(user.user_id).equal(userParams.user_id)
    expect(user.email).equal(userParams.email)
    expect(user.password).equal(userParams.password)
    expect(user.level).equal(LevelEnum.ADMIN)
    expect(user.isAdmin).equal(true)
  })

  it('should create a customer User entity object', () => {
    const userParams = {
      user_id,
      email,
      password,
      level: 2
    }
    const user = User.create(userParams)

    expect(user.user_id).equal(userParams.user_id)
    expect(user.email).equal(userParams.email)
    expect(user.password).equal(userParams.password)
    expect(user.level).equal(LevelEnum.CUSTOMER)
    expect(user.isCustomer).equal(true)
  })

  it('should fail when trying to create an User entity with empty user_id', () => {
    const userParams = {
      user_id: '',
      email,
      password,
      level: 1
    }

    expect(() => User.create(userParams)).throw('User: "user_id" required')
  })

  it('should fail when trying to create an User entity with invalid user_id', () => {
    const userParams = {
      user_id: 'test',
      email,
      password,
      level: 1
    }

    expect(() => User.create(userParams)).throw('User: Invalid "user_id"')
  })

  it('should fail when trying to create an User entity with empty email', () => {
    const userParams = {
      user_id,
      email: '',
      password,
      level: 0
    }

    expect(() => User.create(userParams)).throw('User: "email" required')
  })

  it('should fail when trying to create an User entity with invalid email', () => {
    const userParams = {
      user_id,
      email: 'email',
      password,
      level: 0
    }

    expect(() => User.create(userParams)).throw('User: Invalid "email"')
  })

  it('should fail when trying to create an User entity with empty password', () => {
    const userParams = {
      user_id,
      email,
      password: '',
      level: 0
    }

    expect(() => User.create(userParams)).throw('User: "password" required')
  })

  it('should fail when trying to create an User entity with invalid level', () => {
    const userParams = {
      user_id,
      email,
      password,
      level: -1
    }

    expect(() => User.create(userParams)).throw('User: Invalid "level"')
  })
})
