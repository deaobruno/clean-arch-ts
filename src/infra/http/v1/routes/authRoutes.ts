import IServer from "../../../drivers/server/IServerDriver";

export default (dependencies: any, server: IServer, prefix?: string): void => {
  const basePath = `${prefix}/auth`;
  const {
    registerCustomerController,
    loginController,
    refreshAccessTokenController,
    logoutController,
  } = dependencies;
  const { post, delete: del } = server;

  post(`${basePath}/register`, registerCustomerController);
  post(`${basePath}/login`, loginController);
  post(`${basePath}/refresh-token`, refreshAccessTokenController);
  del(`${basePath}/logout`, logoutController);
};
