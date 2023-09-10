import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import AuthenticateUserSchema from '../../../../../src/infra/schemas/auth/AuthenticateUserSchema'

const { validate } = AuthenticateUserSchema

describe('/infra/schemas/auth/AuthenticateUserSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      email: faker.internet.email(),
      password: 'test',
    })

    expect(validation).equal(undefined)
  })

  it('should fail when email is empty', () => {
    const validation = <Error>validate({
      email: '',
      password: 'test',
    })

    expect(validation.message).equal('"email" is required')
  })

  it('should fail when passing a number as email', () => {
    const validation = <Error>validate({
      email: 123,
      password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing a boolean as email', () => {
    const validation = <Error>validate({
      email: true,
      password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing an object as email', () => {
    const validation = <Error>validate({
      email: { test: 'test' },
      password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing a Bigint as email', () => {
    const validation = <Error>validate({
      email: BigInt(9007199254740991n),
      password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing invalid email', () => {
    const validation = <Error>validate({
      email: 'test',
      password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when missing password', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: '',
    })

    expect(validation.message).equal('"password" is required')
  })

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: 'test',
      test: 'test'
    })

    expect(validation.message).equal('Invalid param(s): "test"')
  })
})
