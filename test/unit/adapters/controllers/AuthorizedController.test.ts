import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import AuthorizedController from '../../../../src/adapters/controllers/AuthorizedController'
import IUseCase from '../../../../src/application/useCases/IUseCase'
import ISchema from '../../../../src/infra/schemas/ISchema'
import ControllerConfig from '../../../../src/adapters/controllers/ControllerConfig'
import ValidateAuthentication from '../../../../src/application/useCases/auth/ValidateAuthentication'
import tokenDriverMock from '../../../mocks/drivers/TokenDriverMock'
import inMemoryRefreshTokenRepositoryMock from '../../../mocks/repositories/inMemory/InMemoryRefreshTokenRepositoryMock'
import ValidateAuthorization from '../../../../src/application/useCases/auth/ValidateAuthorization'
import { LevelEnum } from '../../../../src/domain/User'
import ForbiddenError from '../../../../src/application/errors/ForbiddenError'

class CustomController extends AuthorizedController {
  statusCode = 200

  constructor(config: ControllerConfig<IUseCase<any, any>, ISchema>) {
    super(config)
  }
}

const sandbox = sinon.createSandbox()
const validateAuthenticationUseCase = new ValidateAuthentication(tokenDriverMock, inMemoryRefreshTokenRepositoryMock)
const validateAuthorizationUseCase = new ValidateAuthorization()

describe('/adapters/controllers/AuthorizedController.ts', () => {
  afterEach(() => sandbox.restore())

  it('should return successfully when authorized', async () => {
    sandbox.stub(validateAuthenticationUseCase, 'exec')
      .resolves({
        user: {
          userId: faker.string.uuid(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          level: LevelEnum.CUSTOMER,
          isRoot: false,
          isAdmin: false,
          isCustomer: true,
        }
      })
    sandbox.stub(validateAuthorizationUseCase, 'exec')
      .returns()

    const useCase = {
      exec: async (data: any) => {
        return
      }
    }
    const customController = new CustomController({ useCase, validateAuthenticationUseCase, validateAuthorizationUseCase })
    const result = await customController.handle({ authorization: 'Bearer token' }, {})

    expect(result).equal(undefined)
  })

  it('should return error when not authorized', async () => {
    sandbox.stub(validateAuthenticationUseCase, 'exec')
      .resolves({
        user: {
          userId: faker.string.uuid(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          level: LevelEnum.CUSTOMER,
          isRoot: false,
          isAdmin: false,
          isCustomer: true,
        }
      })
    sandbox.stub(validateAuthorizationUseCase, 'exec')
      .returns(new ForbiddenError())

    const useCase = {
      exec: async (data: any) => {
        return
      }
    }
    const customController = new CustomController({ useCase, validateAuthenticationUseCase, validateAuthorizationUseCase })
    const result = await customController.handle({ authorization: 'Bearer token' }, {})

    expect(result.message).equal('Forbidden')
    expect(result.statusCode).equal(403)
  })

  it('should throw error when ValidateAuthorizationUseCase is not passed to authorized Controller', async () => {
    const useCase = {
      exec: async (data: any) => {
        return
      }
    }

    expect(() => new CustomController({ useCase, validateAuthenticationUseCase })).throw('[CustomController] Authorization use case is required')
  })
})
