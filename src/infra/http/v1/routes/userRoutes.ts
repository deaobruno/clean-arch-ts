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
    new CreateAdminRoute(`${basePath}/create-admin`, createAdminController, adminPresenter, [validateCreateAdminPayloadMiddleware, validateAuthenticationMiddleware, validateAuthorizationMiddleware]),
    new FindUsersRoute(basePath, findUsersController, customerPresenter, [validateFindUsersPayloadMiddleware, validateAuthenticationMiddleware, validateAuthorizationMiddleware]),
    new FindUserByIdRoute(`${basePath}/:userId`, findUserByIdController, customerPresenter, [validateFindUserByIdPayloadMiddleware, validateAuthenticationMiddleware]),
    new UpdateUserRoute(`${basePath}/:userId`, updateUserController, customerPresenter, [validateUpdateUserPayloadMiddleware, validateAuthenticationMiddleware]),
    new UpdateUserPasswordRoute(`${basePath}/:userId/update-password`, updateUserPasswordController, customerPresenter, [validateUpdateUserPasswordPayloadMiddleware, validateAuthenticationMiddleware]),
    new DeleteUserRoute(`${basePath}/:userId`, deleteUserController, [validateDeleteUserPayloadMiddleware, validateAuthenticationMiddleware, validateAuthorizationMiddleware]),
  ]
}
