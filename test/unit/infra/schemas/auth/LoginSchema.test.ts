import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import LoginSchema from '../../../../../src/infra/schemas/auth/LoginSchema'

const { validate } = LoginSchema

describe('/infra/schemas/auth/LoginSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
    })

    expect(validation).equal(undefined)
  })

  it('should fail when email is empty', () => {
    const validation = <Error>validate({
      email: '',
      password: 'test',
    })

    expect(validation.message).equal('"email" is not allowed to be empty')
  })

  it('should fail when passing a number as email', () => {
    const validation = <Error>validate({
      email: 123,
      password: 'test',
    })

    expect(validation.message).equal('"email" must be a string')
  })

  it('should fail when passing a boolean as email', () => {
    const validation = <Error>validate({
      email: true,
      password: 'test',
    })

    expect(validation.message).equal('"email" must be a string')
  })

  it('should fail when passing an object as email', () => {
    const validation = <Error>validate({
      email: { test: 'test' },
      password: 'test',
    })

    expect(validation.message).equal('"email" must be a string')
  })

  it('should fail when passing a Bigint as email', () => {
    const validation = <Error>validate({
      email: BigInt(9007199254740991n),
      password: 'test',
    })

    expect(validation.message).equal('"email" must be a string')
  })

  it('should fail when passing invalid email', () => {
    const validation = <Error>validate({
      email: 'test',
      password: 'test',
    })

    expect(validation.message).equal('"email" must be a valid email')
  })

  it('should fail when missing password', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: '',
    })

    expect(validation.message).equal('"password" is not allowed to be empty')
  })

  it('should fail when missing password', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: '1',
    })

    expect(validation.message).equal('"password" length must be at least 8 characters long')
  })

  it('should fail when missing password', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: '123456789123456789',
    })

    expect(validation.message).equal('"password" length must be less than or equal to 16 characters long')
  })

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
      test: 'test'
    })

    expect(validation.message).equal('"test" is not allowed')
  })
})
