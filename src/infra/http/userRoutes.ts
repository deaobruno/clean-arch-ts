import CreateAdminRoute from './routes/user/CreateAdminRoute'
import DeleteUserRoute from './routes/user/DeleteUserRoute'
import FindUserByIdRoute from './routes/user/FindUserByIdRoute'
import FindUsersRoute from './routes/user/FindUsersRoute'
import UpdateUserPasswordRoute from './routes/user/UpdateUserPasswordRoute'
import UpdateUserRoute from './routes/user/UpdateUserRoute'

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
    new CreateAdminRoute(`${basePath}/admin`, createAdminController, adminPresenter),
    new FindUsersRoute(basePath, findUsersController, customerPresenter),
    new FindUserByIdRoute(`${basePath}/:userId`, findUserByIdController, customerPresenter),
    new UpdateUserRoute(`${basePath}/:userId`, updateUserController, customerPresenter),
    new UpdateUserPasswordRoute(`${basePath}/:userId/update-password`, updateUserPasswordController, customerPresenter),
    new DeleteUserRoute(`${basePath}/:userId`, deleteUserController),
  ]
}
