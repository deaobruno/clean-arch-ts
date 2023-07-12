import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import RefreshToken from '../../../src/domain/RefreshToken'

describe('/domain/RefreshToken.ts', () => {
  it('should create a root User entity object', () => {
    const refreshToken = RefreshToken.create({ token: faker.string.alphanumeric() })

    expect(typeof refreshToken.token).equal('string')
  })

  it('should fail when trying to create an User entity with empty token', () => {
    expect(() => RefreshToken.create({ token: '' })).throw('RefreshToken: "token" required')
  })
})
