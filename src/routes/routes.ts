import dependenciesContainer from '../dependencies';
import IServer from '../infra/drivers/server/IServerDriver';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import memoRoutes from './memoRoutes';

export default (
  dependencies: typeof dependenciesContainer,
  server: IServer,
): void => {
  const prefix = '/api/v1';

  authRoutes(dependencies, server, prefix);
  userRoutes(dependencies, server, prefix);
  memoRoutes(dependencies, server, prefix);
};
