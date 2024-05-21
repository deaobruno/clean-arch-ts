import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import AuthenticatedController from '../../../../src/adapters/controllers/AuthenticatedController';
import BadRequestError from '../../../../src/application/errors/BadRequestError';
import ValidateAuthentication from '../../../../src/application/useCases/auth/ValidateAuthentication';
import JwtDriver from '../../../../src/infra/drivers/token/JwtDriver';
import UserRole from '../../../../src/domain/user/UserRole';
import RefreshTokenRepository from '../../../../src/adapters/repositories/RefreshTokenRepository';
import UserRepository from '../../../../src/adapters/repositories/UserRepository';
import User from '../../../../src/domain/user/User';
import RefreshToken from '../../../../src/domain/refreshToken/RefreshToken';
import BaseError from '../../../../src/application/errors/BaseError';
import PinoDriver from '../../../../src/infra/drivers/logger/PinoDriver';

class CustomController extends AuthenticatedController {
  statusCode = 200;
}

const sandbox = sinon.createSandbox();
const logger = sandbox.createStubInstance(PinoDriver);
const validateAuthenticationUseCase = new ValidateAuthentication(
  logger,
  sandbox.createStubInstance(JwtDriver),
  sandbox.createStubInstance(RefreshTokenRepository),
  sandbox.createStubInstance(UserRepository),
);

describe('/adapters/controllers/AuthenticatedController.ts', () => {
  afterEach(() => sandbox.restore());

  it('should return successfully when authenticated', async () => {
    const userId = faker.string.uuid();

    sandbox.stub(validateAuthenticationUseCase, 'exec').resolves({
      user: <User>User.create({
        userId,
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      }),
      refreshToken: <RefreshToken>RefreshToken.create({
        userId,
        token: 'refresh-token',
      }),
    });

    const useCase = {
      exec: async () => {},
    };
    const customerController = new CustomController({
      logger,
      useCase,
      validateAuthenticationUseCase,
    });
    const result = await customerController.handle(
      { authorization: 'Bearer token' },
      {},
    );

    expect(result).equal(undefined);
  });

  it('should return error when not authenticated', async () => {
    sandbox
      .stub(validateAuthenticationUseCase, 'exec')
      .resolves(new BadRequestError());

    const useCase = {
      exec: async (data: unknown) => {
        return data;
      },
    };
    const customerController = new CustomController({
      logger,
      useCase,
      validateAuthenticationUseCase,
    });
    const result = <BaseError>(
      await customerController.handle({ authorization: 'Bearer token' }, {})
    );

    expect(result.message).equal('Bad Request');
    expect(result.statusCode).equal(400);
  });

  it('should throw error when ValidateAuthenticationUseCase is not passed to AuthenticatedController', async () => {
    const useCase = {
      exec: async (data: unknown) => {
        return data;
      },
    };

    expect(() => new CustomController({ logger, useCase })).throw(
      '[CustomController] Authentication use case is required',
    );
  });
});
