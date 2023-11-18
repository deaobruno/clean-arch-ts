import BadRequestError from "../../application/errors/BadRequestError";
import IUseCase from "../../application/useCases/IUseCase";
import ValidateAuthentication from "../../application/useCases/auth/ValidateAuthentication";
import ValidateAuthorization from "../../application/useCases/auth/ValidateAuthorization";
import User from "../../domain/user/User";
import ISchema from "../../infra/schemas/ISchema";
import IPresenter from "../presenters/IPresenter";
import ControllerConfig from "./ControllerConfig";

export default abstract class BaseController {
  abstract readonly statusCode: number;
  protected authenticate = false;
  protected authorize = false;
  private _useCase: IUseCase<any, any>;
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

  async handle(headers: any, payload: any): Promise<any> {
    const { authorization } = headers;
    let requestUser: User | undefined;

    if (this.authenticate && this._validateAuthenticationUseCase) {
      const authentication = await this._validateAuthenticationUseCase.exec({
        authorization,
      });

      if (authentication instanceof Error) return authentication;

      const { user } = authentication;

      requestUser = user;

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

    const data = await this._useCase.exec(payload);

    if (data instanceof Error || !this._presenter) return data;

    return Array.isArray(data)
      ? data.map(this._presenter.toJson)
      : this._presenter.toJson(data);
  }
}
