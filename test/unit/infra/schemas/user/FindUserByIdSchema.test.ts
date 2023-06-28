import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import FindUserByIdSchema from '../../../../../src/infra/schemas/user/FindUserByIdSchema'

const { validate } = FindUserByIdSchema
const userId = faker.datatype.uuid()

describe('/infra/schemas/user/FindUserByIdSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({ userId })

    expect(validation).equal(undefined)
  })

  it('should fail when user ID is empty', () => {
    const validation = <Error>validate({ userId: '' })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when passing a number as user ID', () => {
    const validation = <Error>validate({ userId: 123 })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when passing a boolean as user ID', () => {
    const validation = <Error>validate({ userId: true })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when passing an object as user ID', () => {
    const validation = <Error>validate({ userId: { test: 'test' } })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when passing a Bigint as user ID', () => {
    const validation = <Error>validate({ userId: BigInt(9007199254740991n) })

    expect(validation.message).equal('Invalid "user_id" format')
  })

  it('should fail when passing invalid user ID', () => {
    const validation = <Error>validate({ userId: 'test' })

    expect(validation.message).equal('Invalid "user_id" format')
  })
})
