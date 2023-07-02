import AuthenticateUserRoute from './auth/AuthenticateUserRoute'
import RegisterUserRoute from './auth/RegisterUserRoute'

const basePath = '/auth'

export default (dependencies: any) => {
  const {
    controllers: {
      registerUserController,
      authenticateUserController,
    },
    presenters: {
      customerPresenter,
    }
  } = dependencies

  return [
    new RegisterUserRoute(`${basePath}/register`, registerUserController, customerPresenter),
    new AuthenticateUserRoute(basePath, authenticateUserController),
  ]
}
