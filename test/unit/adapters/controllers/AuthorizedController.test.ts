import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import AuthorizedController from '../../../../src/adapters/controllers/AuthorizedController';
import ValidateAuthentication from '../../../../src/application/useCases/auth/ValidateAuthentication';
import JwtDriver from '../../../../src/infra/drivers/token/JwtDriver';
import ValidateAuthorization from '../../../../src/application/useCases/auth/ValidateAuthorization';
import UserRole from '../../../../src/domain/user/UserRole';
import ForbiddenError from '../../../../src/application/errors/ForbiddenError';
import RefreshTokenRepository from '../../../../src/adapters/repositories/RefreshTokenRepository';
import UserRepository from '../../../../src/adapters/repositories/UserRepository';
import User from '../../../../src/domain/user/User';
import RefreshToken from '../../../../src/domain/refreshToken/RefreshToken';
import BaseError from '../../../../src/application/errors/BaseError';

class CustomController extends AuthorizedController {
  statusCode = 200;
}

const sandbox = sinon.createSandbox();
const refreshTokenRepository = sandbox.createStubInstance(
  RefreshTokenRepository,
);
const userRepository = sandbox.createStubInstance(UserRepository);
const validateAuthenticationUseCase = new ValidateAuthentication(
  sandbox.createStubInstance(JwtDriver),
  refreshTokenRepository,
  userRepository,
);
const validateAuthorizationUseCase = new ValidateAuthorization();

describe('/adapters/controllers/AuthorizedController.ts', () => {
  afterEach(() => sandbox.restore());

  it('should return successfully when authorized', async () => {
    const userId = faker.string.uuid();

    sandbox.stub(validateAuthenticationUseCase, 'exec').resolves({
      user: User.create({
        userId,
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      }),
      refreshToken: RefreshToken.create({
        userId,
        token: 'refresh-token',
      }),
    });
    sandbox.stub(validateAuthorizationUseCase, 'exec').returns();

    const useCase = {
      exec: async (data: any) => {
        return;
      },
    };
    const customController = new CustomController({
      useCase,
      validateAuthenticationUseCase,
      validateAuthorizationUseCase,
    });
    const result = await customController.handle(
      { authorization: 'Bearer token' },
      {},
    );

    expect(result).equal(undefined);
  });

  it('should return error when not authorized', async () => {
    const userId = faker.string.uuid();

    sandbox.stub(validateAuthenticationUseCase, 'exec').resolves({
      user: User.create({
        userId,
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      }),
      refreshToken: RefreshToken.create({
        userId,
        token: 'refresh-token',
      }),
    });
    sandbox
      .stub(validateAuthorizationUseCase, 'exec')
      .returns(new ForbiddenError());

    const useCase = {
      exec: async (data: any) => {
        return;
      },
    };
    const customController = new CustomController({
      useCase,
      validateAuthenticationUseCase,
      validateAuthorizationUseCase,
    });
    const result = <BaseError>(
      await customController.handle({ authorization: 'Bearer token' }, {})
    );

    expect(result.message).equal('Forbidden');
    expect(result.statusCode).equal(403);
  });

  it('should throw error when ValidateAuthorizationUseCase is not passed to authorized Controller', async () => {
    const useCase = {
      exec: async (data: any) => {
        return;
      },
    };

    expect(
      () => new CustomController({ useCase, validateAuthenticationUseCase }),
    ).throw('[CustomController] Authorization use case is required');
  });
});
