import RefreshToken from "./RefreshToken";

export default interface IRefreshTokenRepository {
  create(refreshToken: RefreshToken): Promise<void>;
  find(filters?: object): Promise<RefreshToken[]>;
  findOne(filters: object): Promise<RefreshToken | undefined>;
  findOneByUserId(userId: string): Promise<RefreshToken | undefined>;
  findOneByToken(token: string): Promise<RefreshToken | undefined>;
  delete(filters: object): Promise<void>;
}
