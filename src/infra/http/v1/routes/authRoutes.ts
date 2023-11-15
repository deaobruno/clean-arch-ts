import IServer from "../../../drivers/server/IServerDriver";

export default (dependencies: any, server: IServer, prefix?: string): any[] => {
  const basePath = `${prefix}/auth`;
  const {
    registerCustomerController,
    authenticateUserController,
    refreshAccessTokenController,
    logoutController,
  } = dependencies;
  const { post, delete: del } = server;

  return [
    post(`${basePath}/register`, registerCustomerController),
    post(`${basePath}/login`, authenticateUserController),
    post(`${basePath}/refresh-token`, refreshAccessTokenController),
    del(`${basePath}/logout`, logoutController),
  ];
};
