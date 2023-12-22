import IServer from "../../../drivers/server/IServerDriver";

export default (dependencies: any, server: IServer, prefix?: string): any[] => {
  const basePath = `${prefix}/memos`;
  const {
    createMemoController,
    findMemoByIdController,
    findMemosByUserIdController,
    updateMemoController,
    deleteMemoController,
  } = dependencies;
  const { get, post, put, delete: del } = server;

  return [
    post(`${basePath}`, createMemoController),
    get(`${basePath}/:memo_id`, findMemoByIdController),
    get(`${basePath}/user/:user_id`, findMemosByUserIdController),
    put(`${basePath}/:memo_id`, updateMemoController),
    del(`${basePath}/:memo_id`, deleteMemoController),
  ];
};
