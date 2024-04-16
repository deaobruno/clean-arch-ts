import BadRequestError from '../../application/errors/BadRequestError';
import IUseCase from '../../application/useCases/IUseCase';
import ValidateAuthentication from '../../application/useCases/auth/ValidateAuthentication';
import ValidateAuthorization from '../../application/useCases/auth/ValidateAuthorization';
import RefreshToken from '../../domain/refreshToken/RefreshToken';
import User from '../../domain/user/User';
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
  private _useCase: IUseCase<unknown, unknown>;
  private _validateAuthenticationUseCase?: ValidateAuthentication;
  private _validateAuthorizationUseCase?: ValidateAuthorization;
  private _schema?: ISchema;
  private _presenter?: IPresenter;

  constructor(config: ControllerConfig) {
    this._useCase = config.useCase;
    this._validateAuthenticationUseCase = config.validateAuthenticationUseCase;
    this._validateAuthorizationUseCase = config.validateAuthorizationUseCase;
    this._schema = config.schema;
    this._presenter = config.presenter;
  }

  async handle(headers: Headers, payload: Payload): Promise<unknown> {
    const { authorization, 'content-type': contentType = 'application/json' } =
      headers;
    let requestUser: User | undefined;
    let requestRefreshToken: RefreshToken | undefined;

    if (this.authenticate && this._validateAuthenticationUseCase) {
      const authentication = await this._validateAuthenticationUseCase.exec({
        authorization,
      });

      if (authentication instanceof Error) return authentication;

      const { user, refreshToken } = authentication;

      requestUser = user;
      requestRefreshToken = refreshToken;

      if (
        authentication &&
        this.authorize &&
        this._validateAuthorizationUseCase
      ) {
        const authorization = this._validateAuthorizationUseCase.exec({ user });

        if (authorization instanceof Error) return authorization;
      }
    }

    const error = this._schema?.validate(payload);

    if (error) return new BadRequestError(error.message);
    if (requestUser) payload.user = requestUser;
    if (requestRefreshToken) payload.refreshToken = requestRefreshToken;

    const data = await this._useCase.exec(payload);

    if (data instanceof Error || !this._presenter) return data;

    const presenter = this._presenter[ContentType[contentType]];

    return Array.isArray(data) ? data.map(presenter) : presenter(data);
  }
}
