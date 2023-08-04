import AuthenticateUserRoute from './auth/AuthenticateUserRoute'
import RegisterCustomerRoute from './auth/RegisterCustomerRoute'
import RefreshAccessTokenRoute from './auth/RefreshAccessTokenRoute'
import LogoutRoute from './auth/LogoutRoute'

const basePath = '/auth'

export default (dependencies: any) => {
  const {
    middlewares: {
      validateRegisterCustomerPayloadMiddleware,
      validateAuthenticateUserPayloadMiddleware,
      validateRefreshAccessTokenPayloadMiddleware,
      validateLogoutPayloadMiddleware,
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
    new RegisterCustomerRoute(`${basePath}/register`, registerCustomerController, customerPresenter, [validateRegisterCustomerPayloadMiddleware]),
    new AuthenticateUserRoute(`${basePath}/login`, authenticateUserController, [validateAuthenticateUserPayloadMiddleware]),
    new RefreshAccessTokenRoute(`${basePath}/refresh-token`, refreshAccessTokenController, [validateRefreshAccessTokenPayloadMiddleware, validateAuthenticationMiddleware]),
    new LogoutRoute(`${basePath}/logout`, logoutController, [validateLogoutPayloadMiddleware, validateAuthenticationMiddleware]),
  ]
}
