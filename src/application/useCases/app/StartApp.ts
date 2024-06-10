import IUseCase from '../IUseCase';
import IDbDriver from '../../../infra/drivers/db/IDbDriver';
import ICacheDriver from '../../../infra/drivers/cache/ICacheDriver';
import CreateRootUserEvent from '../../../adapters/events/user/CreateRootUserEvent';
import { Cluster } from 'cluster';
import IServer from '../../../infra/drivers/server/IServerDriver';
import appRoutes from '../../../routes/routes';
import dependenciesContainer from '../../../dependencies';

type Input = {
  cluster: Cluster;
  numCPUs: number;
  dependencies: typeof dependenciesContainer;
  routes: typeof appRoutes;
};

export default class StartApp implements IUseCase<Input, void> {
  constructor(
    private serverDriver: IServer,
    private dbDriver: IDbDriver<unknown>,
    private cacheDriver: ICacheDriver,
    private createRootUserEvent: CreateRootUserEvent,
    private usersSource: string,
    private memosSource: string,
    private rootUserEmail: string,
    private rootUserPassword: string,
    private port: string | number,
    private environment: string,
  ) {}

  async exec(input: Input): Promise<void> {
    const { cluster, numCPUs, dependencies, routes } = input;

    await this.dbDriver.connect();
    await this.dbDriver.createCollection(this.usersSource);
    await this.dbDriver.createCollection(this.memosSource);
    await this.dbDriver.createIndex(this.usersSource, 'user_id');
    await this.dbDriver.createIndex(this.usersSource, 'email');
    await this.dbDriver.createIndex(this.memosSource, 'memo_id');
    await this.cacheDriver.connect();

    this.createRootUserEvent.trigger({
      email: this.rootUserEmail,
      password: this.rootUserPassword,
    });

    routes(dependencies, this.serverDriver);

    if (this.environment === 'production' && cluster.isPrimary)
      for (let i = 0; i < numCPUs; i++) cluster.fork();
    else this.serverDriver.start(this.port);
  }
}
