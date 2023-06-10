import CreateCustomerController from '../../../../../../adapters/controllers/CreateCustomerController'
import CreateAdminController from '../../../../../../adapters/controllers/CreateAdminController'
import FindUsersController from '../../../../../../adapters/controllers/FindUsersController'
import AdminPresenter from '../../../../../../adapters/presenters/AdminPresenter'
import CustomerPresenter from '../../../../../../adapters/presenters/CustomerPresenter'
import InMemoryUserRepository from '../../../../../../adapters/repositories/InMemoryUserRepository'
import CreateUserSchema from '../../../../../schemas/CreateUserSchema'
import Route from '../../../../Route'
import Server from '../../../../Server'
import FindUsersSchema from '../../../../../schemas/FindUsersSchema'

const repository = new InMemoryUserRepository()

const createCustomerController = new CreateCustomerController(repository, CreateUserSchema)
const createAdminController = new CreateAdminController(repository, CreateUserSchema)
const findUsersController = new FindUsersController(repository, FindUsersSchema)

const customerPresenter = new CustomerPresenter()
const adminPresenter = new AdminPresenter()

export default (server: Server) => {
  const createCustomerRoute = server.route(new Route('post', '/users', createCustomerController, customerPresenter))
  const createAdminRoute = server.route(new Route('post', '/users/admin', createAdminController, adminPresenter))
  const findUsersRoute = server.route(new Route('get', '/users', findUsersController, adminPresenter))

  return [
    createCustomerRoute,
    createAdminRoute,
    findUsersRoute,
  ]
}
