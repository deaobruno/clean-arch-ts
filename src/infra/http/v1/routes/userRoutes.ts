import IServer from '../../../drivers/server/IServerDriver'

export default (dependencies: any, server: IServer, prefix?: string) => {
  const basePath = `${ prefix }/users`
  const {
    controllers: {
      createAdminController,
      findUsersController,
      findUserByIdController,
      updateUserController,
      updateUserPasswordController,
      deleteUserController,
    },
  } = dependencies
  const {
    get,
    post,
    put,
    delete: del,
  } = server

  post(`${ basePath }/create-admin`, createAdminController)
  get(basePath, findUsersController)
  get(`${ basePath }/:user_id`, findUserByIdController)
  put(`${ basePath }/:user_id`, updateUserController)
  put(`${ basePath }/:user_id/update-password`, updateUserPasswordController)
  del(`${ basePath }/:user_id`, deleteUserController)
}
