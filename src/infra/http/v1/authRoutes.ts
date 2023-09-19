export default (dependencies: any, prefix?: string) => {
  const basePath = `${ prefix }/auth`
  const {
    drivers: {
      httpServerDriver: {
        post,
        delete: del,
      },
    },
    controllers: {
      registerCustomerController,
      authenticateUserController,
      refreshAccessTokenController,
      logoutController,
    },
  } = dependencies

  return [
    post(`${ basePath }/register`, registerCustomerController),
    post(`${ basePath }/login`, authenticateUserController),
    post(`${ basePath }/refresh-token`, refreshAccessTokenController),
    del(`${ basePath }/logout`, logoutController),
  ]
}
