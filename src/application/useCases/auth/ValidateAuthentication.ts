import User from "../../../domain/user/User";
import IRefreshTokenRepository from "../../../domain/refreshToken/IRefreshTokenRepository";
import ITokenDriver from "../../../infra/drivers/token/ITokenDriver";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import UnauthorizedError from "../../errors/UnauthorizedError";
import InternalServerError from "../../errors/InternalServerError";

type Input = {
  authorization: string;
};

type Output =
  | {
      user: User;
    }
  | BaseError;

export default class ValidateAuthentication implements IUseCase<Input, Output> {
  constructor(
    private _tokenDriver: ITokenDriver,
    private _refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async exec(input: Input): Promise<Output> {
    const { authorization } = input;

    if (!authorization) return new UnauthorizedError("No token provided");

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer")
      return new UnauthorizedError("Invalid authentication type");

    if (!token) return new UnauthorizedError("No token provided");

    let userData;

    try {
      userData = <any>this._tokenDriver.validateAccessToken(token);
    } catch (error: any) {
      if (error.name === "TokenExpiredError")
        return new UnauthorizedError("Token expired");

      return new UnauthorizedError("Invalid token");
    }

    const { id: userId, email, password, level } = userData;
    const refreshToken = await this._refreshTokenRepository.findOneByUserId(
      userId
    );

    if (!refreshToken) return new UnauthorizedError();

    const user = User.create({
      userId,
      email,
      password,
      level,
    });

    if (user instanceof Error) return new InternalServerError(user.message);

    return { user };
  }
}
