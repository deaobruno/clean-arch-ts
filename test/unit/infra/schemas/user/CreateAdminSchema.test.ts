import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import CreateAdminSchema from '../../../../../src/infra/schemas/user/CreateAdminSchema'

const { validate } = CreateAdminSchema
const email = faker.internet.email()

describe('/infra/schemas/user/CreateAdminSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      email,
      password: 'test',
      confirm_password: 'test',
    })

    expect(validation).equal(undefined)
  })

  it('should fail when email is empty', () => {
    const validation = <Error>validate({
      email: '',
      password: 'test',
      confirm_password: 'test',
    })

    expect(validation.message).equal('"email" is required')
  })

  it('should fail when passing a number as email', () => {
    const validation = <Error>validate({
      email: 123,
      password: 'test',
      confirm_password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing a boolean as email', () => {
    const validation = <Error>validate({
      email: true,
      password: 'test',
      confirm_password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing an object as email', () => {
    const validation = <Error>validate({
      email: { test: 'test' },
      password: 'test',
      confirm_password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing a Bigint as email', () => {
    const validation = <Error>validate({
      email: BigInt(9007199254740991n),
      password: 'test',
      confirm_password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing invalid email', () => {
    const validation = <Error>validate({
      email: 'test',
      password: 'test',
      confirm_password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when missing password', () => {
    const validation = <Error>validate({
      email,
      password: '',
      confirm_password: 'test',
    })

    expect(validation.message).equal('"password" is required')
  })

  it('should fail when missing confirm_password', () => {
    const validation = <Error>validate({
      email,
      password: 'test',
      confirm_password: '',
    })

    expect(validation.message).equal('"confirm_password" is required')
  })

  it('should fail when password and confirm_password are different', () => {
    const validation = <Error>validate({
      email,
      password: 'test',
      confirm_password: 'tes',
    })

    expect(validation.message).equal('Passwords mismatch')
  })

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      email,
      password: 'test',
      confirm_password: 'test',
      test: 'test'
    })

    expect(validation.message).equal('Invalid param(s): "test"')
  })
})
