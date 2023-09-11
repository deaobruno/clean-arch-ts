import CreateAdminRoute from './routes/user/CreateAdminRoute'
import DeleteUserRoute from './routes/user/DeleteUserRoute'
import FindUserByIdRoute from './routes/user/FindUserByIdRoute'
import FindUsersRoute from './routes/user/FindUsersRoute'
import UpdateUserPasswordRoute from './routes/user/UpdateUserPasswordRoute'
import UpdateUserRoute from './routes/user/UpdateUserRoute'

const basePath = '/users'

export default (dependencies: any) => {
  const {
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
    new FindUsersRoute(basePath, findUsersController, adminPresenter),
    new FindUserByIdRoute(`${basePath}/:user_id`, findUserByIdController, customerPresenter),
    new UpdateUserRoute(`${basePath}/:user_id`, updateUserController, customerPresenter),
    new UpdateUserPasswordRoute(`${basePath}/:user_id/update-password`, updateUserPasswordController, customerPresenter),
    new DeleteUserRoute(`${basePath}/:user_id`, deleteUserController),
  ]
}
