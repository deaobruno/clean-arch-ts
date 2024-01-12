import IServer from "../../../drivers/server/IServerDriver";

export default (dependencies: any, server: IServer, prefix?: string): any[] => {
  const basePath = `${prefix}/users`;
  const {
    findUsersController,
    findUserByIdController,
    updateUserController,
    updateUserPasswordController,
    deleteUserController,
  } = dependencies;
  const { get, post, put, delete: del } = server;

  return [
    get(basePath, findUsersController),
    get(`${basePath}/:user_id`, findUserByIdController),
    put(`${basePath}/:user_id`, updateUserController),
    put(`${basePath}/:user_id/update-password`, updateUserPasswordController),
    del(`${basePath}/:user_id`, deleteUserController),
  ];
};
