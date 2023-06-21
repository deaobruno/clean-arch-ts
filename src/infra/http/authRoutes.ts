import RegisterRoute from './routes/auth/RegisterRoute'

const basePath = '/auth'

export default (dependencies: any) => {
  const {
    controllers: {
      registerController,
    },
    presenters: {
      customerPresenter,
    }
  } = dependencies

  return [
    new RegisterRoute(`${basePath}/register`, registerController, customerPresenter),
  ]
}
