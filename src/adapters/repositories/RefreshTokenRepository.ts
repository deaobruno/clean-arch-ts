import IDbDriver from "../../infra/drivers/db/IDbDriver";
import IRefreshTokenRepository from "../../domain/refreshToken/IRefreshTokenRepository";
import RefreshToken from "../../domain/refreshToken/RefreshToken";
import RefreshTokenMapper from "../../domain/refreshToken/RefreshTokenMapper";
import ICacheDriver from "../../infra/drivers/cache/ICacheDriver";

export default class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    private _source: string,
    private _dbDriver: IDbDriver,
    private _cacheDriver: ICacheDriver,
    private _mapper: RefreshTokenMapper,
    private _refreshTokenExpirationTime: number
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

  async findOneByUserId(user_id: string): Promise<RefreshToken | undefined> {
    const cachedRefreshToken = this._cacheDriver.get(`token-${user_id}`);

    if (cachedRefreshToken) return cachedRefreshToken;

    const refreshToken = await this.findOne({ user_id });

    if (refreshToken) {
      this._cacheDriver.set(
        `token-${user_id}`,
        refreshToken,
        this._refreshTokenExpirationTime
      );

      return refreshToken;
    }
  }

  async deleteAllByUserId(user_id: string): Promise<void> {
    await this._dbDriver.deleteMany(this._source, { user_id });

    this._cacheDriver.del(`token-${user_id}`);
  }
}
