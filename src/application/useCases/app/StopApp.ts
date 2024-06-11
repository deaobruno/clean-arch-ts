import IUseCase from '../IUseCase';
import IDbDriver from '../../../infra/drivers/db/IDbDriver';
import ICacheDriver from '../../../infra/drivers/cache/ICacheDriver';
import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import IServer from '../../../infra/drivers/server/IServerDriver';

export default class StopApp implements IUseCase<void, void> {
  constructor(
    private serverDriver: IServer,
    private dbDriver: IDbDriver<unknown>,
    private cacheDriver: ICacheDriver,
    private refreshTokenRepository: IRefreshTokenRepository,
    private rootUserEmail: string,
    private environment: string,
  ) {}

  async exec(): Promise<void> {
    if (this.environment !== 'production')
      await this.refreshTokenRepository.deleteAll();

    await this.cacheDriver.del(this.rootUserEmail);
    await this.dbDriver.disconnect();
    await this.cacheDriver.disconnect();

    this.serverDriver.stop();
  }
}
