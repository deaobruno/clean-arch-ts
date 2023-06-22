import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import UpdateUserSchema from '../../../../../src/infra/schemas/user/UpdateUserSchema'

const { validate } = UpdateUserSchema
const userId = faker.datatype.uuid()
const email = faker.internet.email()

describe('/infra/schemas/user/UpdateUserSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      userId,
      email,
    })

    expect(validation).equal(undefined)
  })

  it('should fail when user ID is empty', () => {
    const validation = <Error>validate({
      userId: '',
      email,
    })

    expect(validation.message).equal('User ID is required')
  })

  it('should fail when passing a number as user ID', () => {
    const validation = <Error>validate({
      userId: 123,
      email,
    })

    expect(validation.message).equal('User ID must be an UUID')
  })

  it('should fail when passing a boolean as user ID', () => {
    const validation = <Error>validate({
      userId: true,
      email,
    })

    expect(validation.message).equal('User ID must be an UUID')
  })

  it('should fail when passing an object as user ID', () => {
    const validation = <Error>validate({
      userId: { test: 'test' },
      email,
    })

    expect(validation.message).equal('User ID must be an UUID')
  })

  it('should fail when passing a Bigint as user ID', () => {
    const validation = <Error>validate({
      userId: BigInt(9007199254740991n),
      email,
    })

    expect(validation.message).equal('User ID must be an UUID')
  })

  it('should fail when passing invalid user ID', () => {
    const validation = <Error>validate({
      userId: 'test',
      email,
    })

    expect(validation.message).equal('User ID must be an UUID')
  })

  it('should fail when email is empty', () => {
    const validation = <Error>validate({
      userId,
      email: '',
    })

    expect(validation.message).equal('"email" is required')
  })

  it('should fail when passing a number as email', () => {
    const validation = <Error>validate({
      userId,
      email: 123,
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing a boolean as email', () => {
    const validation = <Error>validate({
      userId,
      email: true,
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing an object as email', () => {
    const validation = <Error>validate({
      userId,
      email: { test: 'test' },
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing a Bigint as email', () => {
    const validation = <Error>validate({
      userId,
      email: BigInt(9007199254740991n),
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing invalid email', () => {
    const validation = <Error>validate({
      userId,
      email: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      userId,
      test: 'test'
    })

    expect(validation.message).equal('Invalid param: "test"')
  })
})
