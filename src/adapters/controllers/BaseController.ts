import BadRequestError from '../../application/errors/BadRequestError';
import IUseCase from '../../application/useCases/IUseCase';
import ValidateAuthentication from '../../application/useCases/auth/ValidateAuthentication';
import ValidateAuthorization from '../../application/useCases/auth/ValidateAuthorization';
import RefreshToken from '../../domain/refreshToken/RefreshToken';
import User from '../../domain/user/User';
import ILoggerDriver from '../../infra/drivers/logger/ILoggerDriver';
import ISchema from '../../infra/schemas/ISchema';
import IPresenter from '../presenters/IPresenter';
import ControllerConfig from './ControllerConfig';

type Headers = {
  authorization?: string;
  'content-type'?: string;
};

type Payload = {
  user?: User;
  refreshToken?: RefreshToken;
};

enum ContentType {
  'application/json' = 'toJson',
}

export default abstract class BaseController {
  abstract readonly statusCode: number;
  protected authenticate = false;
  protected authorize = false;
  private logger: ILoggerDriver;
  private useCase: IUseCase<unknown, unknown>;
  private validateAuthenticationUseCase?: ValidateAuthentication;
  private validateAuthorizationUseCase?: ValidateAuthorization;
  private schema?: ISchema;
  private presenter?: IPresenter;

  constructor(config: ControllerConfig) {
    this.logger = config.logger;
    this.useCase = config.useCase;
    this.validateAuthenticationUseCase = config.validateAuthenticationUseCase;
    this.validateAuthorizationUseCase = config.validateAuthorizationUseCase;
    this.schema = config.schema;
    this.presenter = config.presenter;
  }

  async handle(headers: Headers, payload: Payload): Promise<unknown> {
    const { authorization, 'content-type': contentType = 'application/json' } =
      headers;
    let user;
    let refreshToken;

    if (this.authenticate && this.validateAuthenticationUseCase) {
      const authentication = await this.validateAuthenticationUseCase.exec({
        authorization,
      });

      if (authentication instanceof Error) {
        this.logger.debug({
          message: `[${this.constructor.name}] Authentication failed`,
          headers,
          payload,
          error: authentication,
        });

        return authentication;
      }

      user = authentication.user;
      refreshToken = authentication.refreshToken;

      if (
        authentication &&
        this.authorize &&
        this.validateAuthorizationUseCase
      ) {
        const authorization = this.validateAuthorizationUseCase.exec({ user });

        if (authorization instanceof Error) {
          this.logger.debug({
            message: `[${this.constructor.name}] Authorization failed`,
            headers,
            payload,
            error: authorization,
          });

          return authorization;
        }
      }
    }

    const error = this.schema?.validate(payload);

    if (error) {
      this.logger.debug({
        message: `[${this.constructor.name}] Data validation error`,
        headers,
        payload,
        error,
      });

      return new BadRequestError(error.message);
    }

    if (user) payload.user = user;
    if (refreshToken) payload.refreshToken = refreshToken;

    const data = await this.useCase.exec(payload);

    if (data instanceof Error) {
      this.logger.debug({
        message: `[${this.constructor.name}] Use case error`,
        headers,
        payload,
        error: data,
      });

      return data;
    }

    if (!this.presenter) {
      this.logger.debug({
        message: `[${this.constructor.name}] Use case success`,
        headers,
        payload,
        data,
      });

      return data;
    }

    const presenter = this.presenter[ContentType[contentType]];
    const output = Array.isArray(data) ? data.map(presenter) : presenter(data);

    this.logger.debug({
      message: `[${this.constructor.name}] Use case success`,
      headers,
      payload,
      data: output,
    });

    return output;
  }
}
