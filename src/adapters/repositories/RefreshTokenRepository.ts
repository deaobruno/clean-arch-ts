import IDbDriver from '../../infra/drivers/db/IDbDriver';
import IRefreshTokenRepository from '../../domain/refreshToken/IRefreshTokenRepository';
import RefreshToken from '../../domain/refreshToken/RefreshToken';
import RefreshTokenMapper from '../../domain/refreshToken/RefreshTokenMapper';
import ICacheDriver from '../../infra/drivers/cache/ICacheDriver';
import User from '../../domain/user/User';
import IDbRefreshToken from '../../domain/refreshToken/IDbRefreshToken';
import ILoggerDriver from '../../infra/drivers/logger/ILoggerDriver';

export default class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    private source: string,
    private logger: ILoggerDriver,
    private db: IDbDriver<IDbRefreshToken>,
    private cache: ICacheDriver,
    private mapper: RefreshTokenMapper,
    private refreshTokenExpirationTime: number,
  ) {}

  async create(refreshToken: RefreshToken): Promise<void> {
    const dbRefreshToken = this.mapper.entityToDb(refreshToken);

    await this.db.create(this.source, dbRefreshToken);

    this.logger.debug({
      message: '[RefreshTokenRepository/create] Refresh token created',
      refreshToken,
      dbRefreshToken,
    });
  }

  async find(filters?: object, options = {}): Promise<RefreshToken[]> {
    const dbRefreshTokens = await this.db.find(this.source, filters, options);
    const refreshTokens = dbRefreshTokens.map(
      (refreshToken) => <RefreshToken>this.mapper.dbToEntity(refreshToken),
    );
    const message =
      refreshTokens.length > 0
        ? '[RefreshTokenRepository/find] Refresh token(s) found'
        : '[RefreshTokenRepository/find] Refresh tokens not found';

    this.logger.debug({
      message,
      filters,
      options,
      dbRefreshTokens,
      refreshTokens,
    });

    return refreshTokens;
  }

  async findOne(filters: object): Promise<RefreshToken | undefined> {
    const dbRefreshToken = await this.db.findOne(this.source, filters);

    if (!dbRefreshToken) {
      this.logger.debug({
        message: '[RefreshTokenRepository/findOne] Refresh token not found',
        filters,
      });

      return;
    }

    const refreshToken = <RefreshToken>this.mapper.dbToEntity(dbRefreshToken);

    this.logger.debug({
      message: '[RefreshTokenRepository/findOne] Refresh token found',
      filters,
      dbRefreshToken,
      refreshToken,
    });

    return refreshToken;
  }

  async findOneByUserId(user_id: string): Promise<RefreshToken | undefined> {
    const cachedRefreshToken = <RefreshToken>(
      await this.cache.get(`token-${user_id}`)
    );

    if (cachedRefreshToken) return cachedRefreshToken;

    const refreshToken = await this.findOne({ user_id });

    if (refreshToken) {
      await this.cache.set(
        `token-${user_id}`,
        refreshToken,
        this.refreshTokenExpirationTime,
      );

      return refreshToken;
    }
  }

  async deleteOne(refreshToken: RefreshToken): Promise<void> {
    const { userId, token } = refreshToken;

    await this.db.delete(this.source, { token });
    await this.cache.del(`token-${userId}`);

    this.logger.debug({
      message: '[RefreshTokenRepository/delete] Refresh token deleted',
      refreshToken,
    });
  }

  async deleteAll(): Promise<void> {
    this.logger.debug({
      message: '[RefreshTokenRepository/deleteAll] All refresh tokens deleted',
    });

    await this.db.deleteMany(this.source);
  }

  async deleteAllByUser(user: User): Promise<void> {
    const { userId: user_id } = user;

    await this.db.deleteMany(this.source, { user_id });
    await this.cache.del(`token-${user_id}`);

    this.logger.debug({
      message:
        '[RefreshTokenRepository/deleteAllByUser] Refresh tokens deleted',
      userId: user_id,
    });
  }
}
