import CreateAdminRoute from './CreateAdminRoute'
import CreateCustomerRoute from './CreateCustomerRoute'
import DeleteUserRoute from './DeleteUserRoute'
import FindUserByIdRoute from './FindUserByIdRoute'
import FindUsersRoute from './FindUsersRoute'
import UpdateUserPasswordRoute from './UpdateUserPasswordRoute'
import UpdateUserRoute from './UpdateUserRoute'

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
