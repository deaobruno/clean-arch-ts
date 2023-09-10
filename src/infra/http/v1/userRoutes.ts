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
      validateAuthenticationMiddleware,
      validateAuthorizationMiddleware,
      validateCreateAdminPayloadMiddleware,
      validateFindUsersPayloadMiddleware,
      validateFindUserByIdPayloadMiddleware,
      validateUpdateUserPayloadMiddleware,
      validateUpdateUserPasswordPayloadMiddleware,
      validateDeleteUserPayloadMiddleware,
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
    new CreateAdminRoute(`${basePath}/create-admin`, createAdminController, adminPresenter, [validateAuthenticationMiddleware, validateAuthorizationMiddleware]),
    new FindUsersRoute(basePath, findUsersController, customerPresenter, [validateAuthenticationMiddleware, validateAuthorizationMiddleware]),
    new FindUserByIdRoute(`${basePath}/:userId`, findUserByIdController, customerPresenter, [validateAuthenticationMiddleware]),
    new UpdateUserRoute(`${basePath}/:userId`, updateUserController, customerPresenter, [validateAuthenticationMiddleware]),
    new UpdateUserPasswordRoute(`${basePath}/:userId/update-password`, updateUserPasswordController, customerPresenter, [validateAuthenticationMiddleware]),
    new DeleteUserRoute(`${basePath}/:userId`, deleteUserController, [validateAuthenticationMiddleware, validateAuthorizationMiddleware]),
  ]
}
