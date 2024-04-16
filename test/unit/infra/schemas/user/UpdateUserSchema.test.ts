import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import UpdateUserSchema from '../../../../../src/infra/schemas/user/UpdateUserSchema'

const { validate } = UpdateUserSchema
const user_id = faker.string.uuid()
const email = faker.internet.email()

describe('/infra/schemas/user/UpdateUserSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      user_id,
      email,
    })

    expect(validation).equal(undefined)
  })

  it('should fail when user ID is empty', () => {
    const validation = <Error>validate({
      user_id: '',
      email,
    })

    expect(validation.message).equal('"user_id" is not allowed to be empty');
  })

  it('should fail when passing a number as user ID', () => {
    const validation = <Error>validate({
      user_id: 123,
      email,
    })

    expect(validation.message).equal('"user_id" must be a string');
  })

  it('should fail when passing a boolean as user ID', () => {
    const validation = <Error>validate({
      user_id: true,
      email,
    })

    expect(validation.message).equal('"user_id" must be a string');
  })

  it('should fail when passing an object as user ID', () => {
    const validation = <Error>validate({
      user_id: { test: 'test' },
      email,
    })

    expect(validation.message).equal('"user_id" must be a string');
  })

  it('should fail when passing a Bigint as user ID', () => {
    const validation = <Error>validate({
      user_id: BigInt(9007199254740991n),
      email,
    })

    expect(validation.message).equal('"user_id" must be a string');
  })

  it('should fail when passing invalid user ID', () => {
    const validation = <Error>validate({
      user_id: 'test',
      email,
    })

    expect(validation.message).equal('"user_id" must be a valid GUID');
  })

  it('should fail when email is empty', () => {
    const validation = <Error>validate({
      user_id,
      email: '',
    })

    expect(validation.message).equal('"email" is not allowed to be empty');
  })

  it('should fail when passing a number as email', () => {
    const validation = <Error>validate({
      user_id,
      email: 123,
    })

    expect(validation.message).equal('"email" must be a string');
  })

  it('should fail when passing a boolean as email', () => {
    const validation = <Error>validate({
      user_id,
      email: true,
    })

    expect(validation.message).equal('"email" must be a string');
  })

  it('should fail when passing an object as email', () => {
    const validation = <Error>validate({
      user_id,
      email: { test: 'test' },
    })

    expect(validation.message).equal('"email" must be a string');
  })

  it('should fail when passing a Bigint as email', () => {
    const validation = <Error>validate({
      user_id,
      email: BigInt(9007199254740991n),
    })

    expect(validation.message).equal('"email" must be a string');
  })

  it('should fail when passing invalid email', () => {
    const validation = <Error>validate({
      user_id,
      email: 'test',
    })

    expect(validation.message).equal('"email" must be a valid email');
  })

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      user_id,
      email,
      test: 'test'
    })

    expect(validation.message).equal('"test" is not allowed');
  })
})
