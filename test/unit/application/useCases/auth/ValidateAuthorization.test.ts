import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ValidateAuthorization from '../../../../../src/application/useCases/auth/ValidateAuthorization'
import ForbiddenError from '../../../../../src/application/errors/ForbiddenError'
import BaseError from '../../../../../src/application/errors/BaseError'

const validateAuthorization = new ValidateAuthorization()

describe('/application/useCases/auth/ValidateAuthorization.ts', () => {
  it('should return void when user is root', () => {
    const user = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: 0,
      isRoot: true,
      isAdmin: false,
      isCustomer: false,
    }

    expect(validateAuthorization.exec({ user })).equal(undefined)
  })

  it('should return void when user is admin', () => {
    const user = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: 1,
      isRoot: false,
      isAdmin: true,
      isCustomer: false,
    }

    expect(validateAuthorization.exec({ user })).equal(undefined)
  })

  it('should return a ForbiddenError when user is customer', () => {
    const user = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      level: 2,
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    }
    const error = <BaseError>validateAuthorization.exec({ user })

    expect(error instanceof ForbiddenError).equal(true)
    expect(error.message).equal('Forbidden')
    expect(error.statusCode).equal(403)
  })
})