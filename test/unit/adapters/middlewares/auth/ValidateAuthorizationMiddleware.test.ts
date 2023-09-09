import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import ValidateAuthorizationMiddleware from '../../../../../src/adapters/middlewares/auth/ValidateAuthorizationMiddleware'
import ValidateAuthorization from '../../../../../src/application/useCases/auth/ValidateAuthorization'
import { LevelEnum } from '../../../../../src/domain/User'

describe('/src/adapters/middlewares/auth/ValidateAuthorizationMiddleware.ts', () => {
  it('should return void when passing an admin User in payload', async () => {
    const validateAuthorizationUseCase = new ValidateAuthorization()
    const validateAuthorizationMiddleware = new ValidateAuthorizationMiddleware(validateAuthorizationUseCase)
    const payload = {
      user: {
        userId: faker.string.uuid(),
        email: faker.internet.email(),
        level: LevelEnum.ADMIN,
        password: faker.internet.password(),
        isRoot: false,
        isAdmin: true,
        isCustomer: false,
      }
    }

    sinon
      .stub(validateAuthorizationUseCase, 'exec')
      .resolves()

    const result = await validateAuthorizationMiddleware.handle(payload, {})

    expect(result).deep.equal(undefined)
  })
})
