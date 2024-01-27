import IServer from "../../../drivers/server/IServerDriver";

export default (dependencies: any, server: IServer, prefix?: string): void => {
  const basePath = `${prefix}/users`;
  const {
    findUsersController,
    findUserByIdController,
    findMemosByUserIdController,
    updateUserController,
    updateUserPasswordController,
    deleteUserController,
  } = dependencies;
  const { get, put, delete: del } = server;

  get(basePath, findUsersController);
  get(`${basePath}/:user_id`, findUserByIdController);
  get(`${basePath}/:user_id/memos`, findMemosByUserIdController);
  put(`${basePath}/:user_id`, updateUserController);
  put(`${basePath}/:user_id/update-password`, updateUserPasswordController);
  del(`${basePath}/:user_id`, deleteUserController);
};
