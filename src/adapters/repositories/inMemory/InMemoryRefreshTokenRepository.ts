import IDbDriver from "../../../infra/drivers/db/IDbDriver";
import IRefreshTokenRepository from "../../../domain/refreshToken/IRefreshTokenRepository";
import RefreshToken from "../../../domain/refreshToken/RefreshToken";
import { RefreshTokenMapper } from "../../../domain/refreshToken/RefreshTokenMapper";

export default class InMemoryRefreshTokenRepository
  implements IRefreshTokenRepository
{
  constructor(
    private _source: string,
    private _dbDriver: IDbDriver,
    private _mapper: RefreshTokenMapper
  ) {}

  async create(refreshToken: RefreshToken): Promise<void> {
    const dbRefreshToken = this._mapper.entityToDb(refreshToken);

    await this._dbDriver.create(this._source, dbRefreshToken);
  }

  async find(filters?: object): Promise<RefreshToken[]> {
    const refreshTokens = await this._dbDriver.find(this._source, filters);

    return refreshTokens.map(this._mapper.dbToEntity);
  }

  async findOne(filters: object): Promise<RefreshToken | undefined> {
    const refreshToken = await this._dbDriver.findOne(this._source, filters);

    if (refreshToken) return this._mapper.dbToEntity(refreshToken);
  }

  async findOneByUserId(userId: string): Promise<RefreshToken | undefined> {
    const refreshToken = await this._dbDriver.findOne(this._source, {
      user_id: userId,
    });

    if (refreshToken) return this._mapper.dbToEntity(refreshToken);
  }

  async findOneByToken(token: string): Promise<RefreshToken | undefined> {
    const refreshToken = await this._dbDriver.findOne(this._source, { token });

    if (refreshToken) return this._mapper.dbToEntity(refreshToken);
  }

  async delete(filters = {}): Promise<void> {
    await this._dbDriver.delete(this._source, filters);
  }
}
