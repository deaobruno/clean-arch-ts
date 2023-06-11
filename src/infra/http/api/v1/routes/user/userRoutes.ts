import CreateCustomerController from '../../../../../../adapters/controllers/user/CreateCustomerController'
import CreateAdminController from '../../../../../../adapters/controllers/user/CreateAdminController'
import FindUsersController from '../../../../../../adapters/controllers/user/FindUsersController'
import AdminPresenter from '../../../../../../adapters/presenters/user/AdminPresenter'
import CustomerPresenter from '../../../../../../adapters/presenters/user/CustomerPresenter'
import InMemoryUserRepository from '../../../../../../adapters/repositories/InMemoryUserRepository'
import CreateUserSchema from '../../../../../schemas/user/CreateUserSchema'
import Server from '../../../../Server'
import FindUsersSchema from '../../../../../schemas/user/FindUsersSchema'
import FindUserByIdController from '../../../../../../adapters/controllers/user/FindUserByIdController'
import UpdateUserController from '../../../../../../adapters/controllers/user/UpdateUserController'
import UpdateUserSchema from '../../../../../schemas/user/UpdateUserSchema'

const repository = new InMemoryUserRepository()

const createCustomerController = new CreateCustomerController(repository, CreateUserSchema)
const createAdminController = new CreateAdminController(repository, CreateUserSchema)
const findUsersController = new FindUsersController(repository, FindUsersSchema)
const findUserByIdController = new FindUserByIdController(repository)
const updateUserController = new UpdateUserController(repository, UpdateUserSchema)

const customerPresenter = new CustomerPresenter()
const adminPresenter = new AdminPresenter()

const basePath = '/users'

export default (server: Server) => {
  const createCustomerRoute = server.route('post', `${basePath}`, createCustomerController, customerPresenter)
  const createAdminRoute = server.route('post', `${basePath}/admin`, createAdminController, adminPresenter)
  const findUsersRoute = server.route('get', `${basePath}`, findUsersController, adminPresenter)
  const findUserByIdRoute = server.route('get', `${basePath}/:userId`, findUserByIdController, customerPresenter)
  const updateUserRoute = server.route('put', `${basePath}/:userId`, updateUserController, customerPresenter)

  return [
    createCustomerRoute,
    createAdminRoute,
    findUsersRoute,
    findUserByIdRoute,
    updateUserRoute,
  ]
}
