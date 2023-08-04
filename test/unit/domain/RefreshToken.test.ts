import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import RefreshToken from '../../../src/domain/RefreshToken'

describe('/domain/RefreshToken.ts', () => {
  it('should create a root User entity object', () => {
    const refreshToken = RefreshToken.create({ user_id: faker.string.uuid(), token: faker.string.alphanumeric() })

    expect(typeof refreshToken.token).equal('string')
  })

  it('should fail when trying to create an User entity with empty user_id', () => {
    expect(() => RefreshToken.create({ user_id: '', token: '' })).throw('RefreshToken: "user_id" required')
  })

  it('should fail when trying to create an User entity with invalid user_id', () => {
    expect(() => RefreshToken.create({ user_id: 'test', token: '' })).throw('RefreshToken: Invalid "user_id"')
  })

  it('should fail when trying to create an User entity with empty token', () => {
    expect(() => RefreshToken.create({ user_id: faker.string.uuid(), token: '' })).throw('RefreshToken: "token" required')
  })
})
