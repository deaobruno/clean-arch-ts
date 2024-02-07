import User from "../user/User";
import RefreshToken from "./RefreshToken";

export default interface IRefreshTokenRepository {
  create(refreshToken: RefreshToken): Promise<void>;
  find(filters?: object, options?: object): Promise<RefreshToken[]>;
  findOne(filters: object): Promise<RefreshToken | undefined>;
  findOneByUserId(userId: string): Promise<RefreshToken | undefined>;
  deleteOne(refreshToken: RefreshToken): Promise<void>;
  deleteAllByUser(user: User): Promise<void>;
}
