import CreateAdminRoute from './user/CreateAdminRoute'
import DeleteUserRoute from './user/DeleteUserRoute'
import FindUserByIdRoute from './user/FindUserByIdRoute'
import FindUsersRoute from './user/FindUsersRoute'
import UpdateUserPasswordRoute from './user/UpdateUserPasswordRoute'
import UpdateUserRoute from './user/UpdateUserRoute'

const basePath = '/users'

export default (dependencies: any) => {
  const {
    middlewares: {
      validateAuthenticationMiddleware,
    },
    controllers: {
      createAdminController,
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
    new CreateAdminRoute(`${basePath}/create-admin`, createAdminController, adminPresenter, [validateAuthenticationMiddleware]),
    new FindUsersRoute(basePath, findUsersController, customerPresenter, [validateAuthenticationMiddleware]),
    new FindUserByIdRoute(`${basePath}/:userId`, findUserByIdController, customerPresenter, [validateAuthenticationMiddleware]),
    new UpdateUserRoute(`${basePath}/:userId`, updateUserController, customerPresenter, [validateAuthenticationMiddleware]),
    new UpdateUserPasswordRoute(`${basePath}/:userId/update-password`, updateUserPasswordController, customerPresenter, [validateAuthenticationMiddleware]),
    new DeleteUserRoute(`${basePath}/:userId`, deleteUserController, [validateAuthenticationMiddleware]),
  ]
}
