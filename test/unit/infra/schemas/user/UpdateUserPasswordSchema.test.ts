import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import UpdateUserPasswordSchema from '../../../../../src/infra/schemas/user/UpdateUserPasswordSchema'

const { validate } = UpdateUserPasswordSchema
const userId = faker.string.uuid()
const password = faker.internet.password()

describe('/infra/schemas/user/UpdateUserPasswordSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      userId,
      password,
      confirm_password: password,
    })

    expect(validation).equal(undefined)
  })

  it('should fail when user ID is empty', () => {
    const validation = <Error>validate({
      userId: '',
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when passing a number as user ID', () => {
    const validation = <Error>validate({
      userId: 123,
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when passing a boolean as user ID', () => {
    const validation = <Error>validate({
      userId: true,
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when passing an object as user ID', () => {
    const validation = <Error>validate({
      userId: { test: 'test' },
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when passing a Bigint as user ID', () => {
    const validation = <Error>validate({
      userId: BigInt(9007199254740991n),
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when passing invalid user ID', () => {
    const validation = <Error>validate({
      userId: 'test',
      password,
      confirm_password: password,
    })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when password is empty', () => {
    const validation = <Error>validate({
      userId,
      password: '',
      confirm_password: password,
    })

    expect(validation.message).equal('"password" is required')
  })

  it('should fail when confirm_password is empty', () => {
    const validation = <Error>validate({
      userId,
      password,
      confirm_password: '',
    })

    expect(validation.message).equal('"confirm_password" is required')
  })

  it('should fail when passwords mismatch', () => {
    const validation = <Error>validate({
      userId,
      password,
      confirm_password: 'test',
    })

    expect(validation.message).equal('Passwords mismatch')
  })

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      userId,
      test: 'test'
    })

    expect(validation.message).equal('Invalid param: "test"')
  })
})
