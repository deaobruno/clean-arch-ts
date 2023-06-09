import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import { LevelEnum, User } from '../../../src/domain/User'

const email = faker.internet.email()
const password = '$Baw@Y;nH5dUq!HRBkGctpiFLYM=73icS^_?e#dTWmM[?g]:1aV#X&w]bXp:KC+h'

describe('/domain/User.ts', () => {
  it('should create an admin User entity object', () => {
    const userParams = {
      email,
      password,
      level: 0
    }
    const user = User.create(userParams)

    expect(typeof user.id).equal('string')
    expect(user.email).equal(userParams.email)
    expect(user.password).equal(userParams.password)
    expect(user.level).equal(LevelEnum.ADMIN)
  })

  it('should create a customer User entity object', () => {
    const userParams = {
      email,
      password,
      level: 1
    }
    const user = User.create(userParams)

    expect(typeof user.id).equal('string')
    expect(user.email).equal(userParams.email)
    expect(user.password).equal(userParams.password)
    expect(user.level).equal(LevelEnum.CUSTOMER)
  })

  it('should fail when trying to create an User entity with empty email', () => {
    const userParams = {
      email: '',
      password,
      level: 0
    }

    expect(() => User.create(userParams)).throw('User: Invalid email')
  })

  it('should fail when trying to create an User entity with invalid email', () => {
    const userParams = {
      email: 'email',
      password,
      level: 0
    }

    expect(() => User.create(userParams)).throw('User: Invalid email')
  })

  it('should fail when trying to create an User entity with empty password', () => {
    const userParams = {
      email,
      password: '',
      level: 0
    }

    expect(() => User.create(userParams)).throw('User: Password required')
  })

  it('should fail when trying to create an User entity with invalid level', () => {
    const userParams = {
      email,
      password,
      level: -1
    }

    expect(() => User.create(userParams)).throw('User: Invalid level')
  })
})
