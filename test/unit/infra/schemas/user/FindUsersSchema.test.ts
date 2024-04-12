import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import FindUsersSchema from '../../../../../src/infra/schemas/user/FindUsersSchema'

const { validate } = FindUsersSchema

describe('/infra/schemas/user/FindUsersSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      email: faker.internet.email(),
    })

    expect(validation).equal(undefined)
  })

  it('should fail when email is empty', () => {
    const validation = <Error>validate({
      email: '',
    })

    expect(validation.message).equal('"email" is not allowed to be empty');
  })

  it('should fail when passing a number as email', () => {
    const validation = <Error>validate({
      email: 123,
    })

    expect(validation.message).equal('"email" must be a string');
  })

  it('should fail when passing a boolean as email', () => {
    const validation = <Error>validate({
      email: true,
    })

    expect(validation.message).equal('"email" must be a string');
  })

  it('should fail when passing an object as email', () => {
    const validation = <Error>validate({
      email: { test: 'test' },
    })

    expect(validation.message).equal('"email" must be a string');
  })

  it('should fail when passing a Bigint as email', () => {
    const validation = <Error>validate({
      email: BigInt(9007199254740991n),
    })

    expect(validation.message).equal('"email" must be a string');
  })

  it('should fail when passing invalid email', () => {
    const validation = <Error>validate({
      email: 'test',
    })

    expect(validation.message).equal('"email" must be a valid email');
  })

  it('should fail when passing invalid param', () => {
    const validation = <Error>validate({
      test: 'test'
    })

    expect(validation.message).equal('"test" is not allowed');
  })
})
