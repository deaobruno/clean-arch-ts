import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import AuthenticatedController from "../../../../src/adapters/controllers/AuthenticatedController";
import IUseCase from "../../../../src/application/useCases/IUseCase";
import ISchema from "../../../../src/infra/schemas/ISchema";
import BadRequestError from "../../../../src/application/errors/BadRequestError";
import ControllerConfig from "../../../../src/adapters/controllers/ControllerConfig";
import ValidateAuthentication from "../../../../src/application/useCases/auth/ValidateAuthentication";
import JwtDriver from "../../../../src/infra/drivers/token/JwtDriver";
import UserRole from "../../../../src/domain/user/UserRole";
import RefreshTokenRepository from "../../../../src/adapters/repositories/RefreshTokenRepository";
import User from "../../../../src/domain/user/User";

class CustomController extends AuthenticatedController {
  statusCode = 200;

  constructor(config: ControllerConfig<IUseCase<any, any>, ISchema>) {
    super(config);
  }
}

const sandbox = sinon.createSandbox();
const refreshTokenRepository = sandbox.createStubInstance(
  RefreshTokenRepository
);
const validateAuthenticationUseCase = new ValidateAuthentication(
  sandbox.createStubInstance(JwtDriver),
  refreshTokenRepository
);

describe("/adapters/controllers/AuthenticatedController.ts", () => {
  afterEach(() => sandbox.restore());

  it("should return successfully when authenticated", async () => {
    sandbox.stub(validateAuthenticationUseCase, "exec").resolves({
      user: User.create({
        userId: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.CUSTOMER,
      }),
    });

    const useCase = {
      exec: async (data: any) => {
        return;
      },
    };
    const customerController = new CustomController({
      useCase,
      validateAuthenticationUseCase,
    });
    const result = await customerController.handle(
      { authorization: "Bearer token" },
      {}
    );

    expect(result).equal(undefined);
  });

  it("should return error when not authenticated", async () => {
    sandbox
      .stub(validateAuthenticationUseCase, "exec")
      .resolves(new BadRequestError());

    const useCase = {
      exec: async (data: any) => {
        return;
      },
    };
    const customerController = new CustomController({
      useCase,
      validateAuthenticationUseCase,
    });
    const result = await customerController.handle(
      { authorization: "Bearer token" },
      {}
    );

    expect(result.message).equal("Bad Request");
    expect(result.statusCode).equal(400);
  });

  it("should throw error when ValidateAuthenticationUseCase is not passed to AuthenticatedController", async () => {
    const useCase = {
      exec: async (data: any) => {
        return;
      },
    };

    expect(() => new CustomController({ useCase })).throw(
      "[CustomController] Authentication use case is required"
    );
  });
});
