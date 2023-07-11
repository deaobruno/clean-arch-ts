import AuthenticateUserRoute from './auth/AuthenticateUserRoute'
import RegisterCustomerRoute from './auth/RegisterCustomerRoute'

const basePath = '/auth'

export default (dependencies: any) => {
  const {
    middlewares: {
      validateRegisterCustomerPayloadMiddleware,
      validateAuthenticateUserPayloadMiddleware,
    },
    controllers: {
      registerCustomerController,
      authenticateUserController,
    },
    presenters: {
      customerPresenter,
    }
  } = dependencies

  return [
    new RegisterCustomerRoute(`${basePath}/register`, registerCustomerController, customerPresenter, [validateRegisterCustomerPayloadMiddleware]),
    new AuthenticateUserRoute(basePath, authenticateUserController, [validateAuthenticateUserPayloadMiddleware]),
  ]
}
