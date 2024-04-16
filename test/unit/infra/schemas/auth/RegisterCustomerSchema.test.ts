import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import RegisterCustomerSchema from '../../../../../src/infra/schemas/auth/RegisterCustomerSchema'

const { validate } = RegisterCustomerSchema

describe('/infra/schemas/auth/RegisterCustomerSchema.ts', () => {
  it('should execute without errors', () => {
    const password = faker.string.alphanumeric(8)
    const validation = validate({
      email: faker.internet.email(),
      password,
      confirm_password: password,
    })

    expect(validation).equal(undefined)
  })

  it('should fail when email is empty', () => {
    const password = faker.string.alphanumeric(8)
    const validation = <Error>validate({
      email: '',
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('"email" is not allowed to be empty')
  })

  it('should fail when passing a number as email', () => {
    const password = faker.string.alphanumeric(8)
    const validation = <Error>validate({
      email: 123,
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('"email" must be a string')
  })

  it('should fail when passing a boolean as email', () => {
    const password = faker.string.alphanumeric(8)
    const validation = <Error>validate({
      email: true,
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('"email" must be a string')
  })

  it('should fail when passing an object as email', () => {
    const password = faker.string.alphanumeric(8)
    const validation = <Error>validate({
      email: { test: 'test' },
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('"email" must be a string')
  })

  it('should fail when passing a Bigint as email', () => {
    const password = faker.string.alphanumeric(8)
    const validation = <Error>validate({
      email: BigInt(9007199254740991n),
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('"email" must be a string')
  })

  it('should fail when passing invalid email', () => {
    const password = faker.string.alphanumeric(8)
    const validation = <Error>validate({
      email: 'test',
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('"email" must be a valid email')
  })

  it('should fail when missing password', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: '',
      confirm_password: faker.string.alphanumeric(8),
    })

    expect(validation.message).equal('"password" is not allowed to be empty')
  })

  it('should fail when missing confirm_password', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
      confirm_password: '',
    })

    expect(validation.message).equal('"confirm_password" must be [ref:password]')
  })

  it('should fail when password and confirm_password are different', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
      confirm_password: '12345678',
    })

    expect(validation.message).equal('"confirm_password" must be [ref:password]')
  })

  it('should fail when passing invalid param', () => {
    const password = faker.string.alphanumeric(8)
    const validation = <Error>validate({
      email: faker.internet.email(),
      password,
      confirm_password: password,
      test: 'test',
    })

    expect(validation.message).equal('"test" is not allowed')
  })
})
