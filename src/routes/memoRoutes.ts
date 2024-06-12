import dependenciesContainer from '../dependencies';
import IServer from '../infra/drivers/server/IServerDriver';

export default (
  dependencies: typeof dependenciesContainer,
  server: IServer,
  prefix?: string,
): void => {
  const basePath = `${prefix}/memos`;
  const {
    createMemoController,
    findMemoByIdController,
    updateMemoController,
    deleteMemoController,
  } = dependencies;
  const { get, post, put, delete: del } = server;

  post(`${basePath}`, createMemoController);
  get(`${basePath}/:memo_id`, findMemoByIdController);
  put(`${basePath}/:memo_id`, updateMemoController);
  del(`${basePath}/:memo_id`, deleteMemoController);
};
