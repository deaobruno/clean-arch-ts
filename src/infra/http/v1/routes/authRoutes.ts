import AuthenticateUserRoute from './auth/AuthenticateUserRoute'
import RegisterCustomerRoute from './auth/RegisterCustomerRoute'
import RefreshAccessTokenRoute from './auth/RefreshAccessTokenRoute'

const basePath = '/auth'

export default (dependencies: any) => {
  const {
    middlewares: {
      validateRegisterCustomerPayloadMiddleware,
      validateAuthenticateUserPayloadMiddleware,
      validateRefreshAccessTokenPayloadMiddleware,
      validateAuthenticationMiddleware,
    },
    controllers: {
      registerCustomerController,
      authenticateUserController,
      refreshAccessTokenController,
    },
    presenters: {
      customerPresenter,
    }
  } = dependencies

  return [
    new RegisterCustomerRoute(`${basePath}/register`, registerCustomerController, customerPresenter, [validateRegisterCustomerPayloadMiddleware]),
    new AuthenticateUserRoute(`${basePath}/login`, authenticateUserController, [validateAuthenticateUserPayloadMiddleware]),
    new RefreshAccessTokenRoute(`${basePath}/refresh-token`, refreshAccessTokenController, [validateRefreshAccessTokenPayloadMiddleware, validateAuthenticationMiddleware]),
  ]
}
