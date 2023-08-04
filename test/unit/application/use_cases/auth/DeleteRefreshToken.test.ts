import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import IRefreshTokenRepository from '../../../../../src/domain/repositories/IRefreshTokenRepository'
import RefreshTokenRepositoryMock from '../../../../mocks/repositories/RefreshTokenRepositoryMock'
import BaseError from '../../../../../src/application/BaseError'
import NotFoundError from '../../../../../src/application/errors/NotFoundError'
import DeleteRefreshToken from '../../../../../src/application/use_cases/auth/DeleteRefreshToken'

const sandbox = sinon.createSandbox()
const refreshTokenRepository: IRefreshTokenRepository = RefreshTokenRepositoryMock
const deleteRefreshToken = new DeleteRefreshToken(refreshTokenRepository)
let notFoundError: BaseError

describe('/application/use_cases/auth/DeleteRefreshToken.ts', () => {
  before(() => {
    notFoundError = sandbox.stub(NotFoundError.prototype)
    notFoundError.name = 'NotFoundError'
    notFoundError.statusCode = 401
    notFoundError.message = 'Not Found'
  })

  afterEach(() => sandbox.restore())

  it('should delete a refresh token', async () => {
    sandbox.stub(refreshTokenRepository, 'findOne')
      .resolves({ user_id: faker.string.uuid(), token: 'token' })

    expect(await deleteRefreshToken.exec({ refreshToken: 'token' })).equal(undefined)
  })

  it('should fail when refresh token is not found', async () => {
    const error = <BaseError>await deleteRefreshToken.exec({ refreshToken: 'token' })

    expect(error instanceof NotFoundError).equal(true)
    expect(error.message).equal('Refresh token not found')
    expect(error.statusCode).equal(404)
  })
})
