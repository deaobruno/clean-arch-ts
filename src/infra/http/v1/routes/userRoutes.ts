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
    new CreateAdminRoute(`${basePath}/create-admin`, createAdminController, adminPresenter),
    new FindUsersRoute(basePath, findUsersController, customerPresenter),
    new FindUserByIdRoute(`${basePath}/:userId`, findUserByIdController, customerPresenter),
    new UpdateUserRoute(`${basePath}/:userId`, updateUserController, customerPresenter),
    new UpdateUserPasswordRoute(`${basePath}/:userId/update-password`, updateUserPasswordController, customerPresenter),
    new DeleteUserRoute(`${basePath}/:userId`, deleteUserController),
  ]
}
