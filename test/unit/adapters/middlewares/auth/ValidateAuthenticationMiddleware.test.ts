import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import JwtDriver from '../../../../../src/infra/drivers/token/JwtDriver'
import InMemoryDriver from '../../../../../src/infra/drivers/db/InMemoryDriver'
import InMemoryRefreshTokenRepository from '../../../../../src/adapters/repositories/inMemory/InMemoryRefreshTokenRepository'
import ValidateAuthenticationMiddleware from '../../../../../src/adapters/middlewares/auth/ValidateAuthenticationMiddleware'
import ValidateAuthentication from '../../../../../src/application/useCases/auth/ValidateAuthentication'
import { RefreshTokenMapper } from '../../../../../src/domain/mappers/RefreshTokenMapper'
import { LevelEnum } from '../../../../../src/domain/User'

describe('/src/adapters/middlewares/auth/ValidateAuthenticationMiddleware.ts', () => {
  it('should return a User entity when passing a Bearer token in authorization header', async () => {
    const jwtDriver = new JwtDriver('access-token-secret', 300, 'refresh-token-secret', 900)
    const dbDriver = new InMemoryDriver()
    const refreshTokenMapper = new RefreshTokenMapper()
    const refreshTokenRepository = new InMemoryRefreshTokenRepository(dbDriver, refreshTokenMapper)
    const validateAuthenticationUseCase = new ValidateAuthentication(jwtDriver, refreshTokenRepository)
    const validateAuthenticationMiddleware = new ValidateAuthenticationMiddleware(validateAuthenticationUseCase)
    const user = {
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      level: LevelEnum.CUSTOMER,
      password: faker.internet.password(),
      isRoot: false,
      isAdmin: false,
      isCustomer: true,
    }
    const headers = { authorization: 'Bearer token' }

    sinon
      .stub(validateAuthenticationUseCase, 'exec')
      .resolves({ user })

    const result = await validateAuthenticationMiddleware.handle({}, headers)

    expect(result.user).deep.equal(user)
  })
})
