export default (dependencies: any, prefix?: string) => {
  const basePath = `${ prefix }/users`
  const {
    drivers: {
      httpServerDriver: {
        get,
        post,
        put,
        delete: del,
      },
    },
    controllers: {
      createAdminController,
      findUsersController,
      findUserByIdController,
      updateUserController,
      updateUserPasswordController,
      deleteUserController,
    },
  } = dependencies

  return [
    post(`${ basePath }/create-admin`, createAdminController),
    get(basePath, findUsersController),
    get(`${ basePath }/:user_id`, findUserByIdController),
    put(`${ basePath }/:user_id`, updateUserController),
    put(`${ basePath }/:user_id/update-password`, updateUserPasswordController),
    del(`${ basePath }/:user_id`, deleteUserController),
  ]
}
