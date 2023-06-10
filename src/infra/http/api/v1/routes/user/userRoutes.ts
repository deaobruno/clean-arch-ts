import CreateUserController from '../../../../../../adapters/controllers/CreateUserController'
import AdminPresenter from '../../../../../../adapters/presenters/AdminPresenter'
import CustomerPresenter from '../../../../../../adapters/presenters/CustomerPresenter'
import InMemoryUserRepository from '../../../../../../adapters/repositories/InMemoryUserRepository'
import CreateAdmin from '../../../../../../application/use_cases/user/CreateAdmin'
import CreateCustomer from '../../../../../../application/use_cases/user/CreateCustomer'
import CreateUserSchema from '../../../../../schemas/CreateUserSchema'
import Route from '../../../../Route'
import Server from '../../../../Server'

const repository = new InMemoryUserRepository()
const createCustomerUseCase = new CreateCustomer(repository)
const createAdminUseCase = new CreateAdmin(repository)
const createCustomerController = new CreateUserController(createCustomerUseCase, CreateUserSchema)
const createAdminController = new CreateUserController(createAdminUseCase, CreateUserSchema)
const customerPresenter = new CustomerPresenter()
const adminPresenter = new AdminPresenter()

export default (server: Server) => {
  const createCustomerRoute = server.route(new Route('post', '/users', createCustomerController, customerPresenter))
  const createAdminRoute = server.route(new Route('post', '/users/admin', createAdminController, adminPresenter))

  return [
    createCustomerRoute,
    createAdminRoute,
  ]
}
