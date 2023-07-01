import AuthenticateUserRoute from './auth/AuthenticateUserRoute'
import RegisterRoute from './auth/RegisterRoute'

const basePath = '/auth'

export default (dependencies: any) => {
  const {
    controllers: {
      registerController,
      authenticateUserController,
    },
    presenters: {
      customerPresenter,
    }
  } = dependencies

  return [
    new RegisterRoute(`${basePath}/register`, registerController, customerPresenter),
    new AuthenticateUserRoute(basePath, authenticateUserController),
  ]
}
