import AuthenticateUserRoute from './routes/auth/AuthenticateUserRoute'
import RegisterCustomerRoute from './routes/auth/RegisterCustomerRoute'
import RefreshAccessTokenRoute from './routes/auth/RefreshAccessTokenRoute'
import LogoutRoute from './routes/auth/LogoutRoute'

const basePath = '/auth'

export default (dependencies: any) => {
  const {
    middlewares: {
      validateAuthenticationMiddleware,
    },
    controllers: {
      registerCustomerController,
      authenticateUserController,
      refreshAccessTokenController,
      logoutController,
    },
    presenters: {
      customerPresenter,
    }
  } = dependencies

  return [
    new RegisterCustomerRoute(`${basePath}/register`, registerCustomerController, customerPresenter),
    new AuthenticateUserRoute(`${basePath}/login`, authenticateUserController),
    new RefreshAccessTokenRoute(`${basePath}/refresh-token`, refreshAccessTokenController, [validateAuthenticationMiddleware]),
    new LogoutRoute(`${basePath}/logout`, logoutController, [validateAuthenticationMiddleware]),
  ]
}
