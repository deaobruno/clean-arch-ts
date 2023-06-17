import CreateAdminRoute from './routes/user/CreateAdminRoute'
import CreateCustomerRoute from './routes/user/CreateCustomerRoute'
import DeleteUserRoute from './routes/user/DeleteUserRoute'
import FindUserByIdRoute from './routes/user/FindUserByIdRoute'
import FindUsersRoute from './routes/user/FindUsersRoute'
import UpdateUserPasswordRoute from './routes/user/UpdateUserPasswordRoute'
import UpdateUserRoute from './routes/user/UpdateUserRoute'

const basePath = '/users'

export default (dependencies: any) => {
  const {
    middlewares: {
      testMiddleware,
    },
    controllers: {
      createAdminController,
      createCustomerController,
      findUsersController,
      findUserByIdController,
      updateUserController,
      updateUserPasswordController,
      deleteUserController,
    },
    presenters: {
      customerPresenter,
      adminPresenter,
    }
  } = dependencies

  return [
    new CreateCustomerRoute(basePath, createCustomerController, customerPresenter),
    new CreateAdminRoute(`${basePath}/admin`, createAdminController, adminPresenter, [testMiddleware]),
    new FindUsersRoute(basePath, findUsersController, customerPresenter),
    new FindUserByIdRoute(`${basePath}/:userId`, findUserByIdController, customerPresenter),
    new UpdateUserRoute(`${basePath}/:userId`, updateUserController, customerPresenter),
    new UpdateUserPasswordRoute(`${basePath}/:userId/update-password`, updateUserPasswordController, customerPresenter),
    new DeleteUserRoute(`${basePath}/:userId`, deleteUserController),
  ]
}
