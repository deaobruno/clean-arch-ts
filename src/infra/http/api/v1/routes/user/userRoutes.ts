import CreateCustomerController from "../../../../../../adapters/controllers/CreateCustomerController";
import CustomerPresenter from "../../../../../../adapters/presenters/CustomerPresenter";
import InMemoryUserRepository from "../../../../../../adapters/repositories/InMemoryUserRepository";
import CreateCustomer from "../../../../../../application/user/CreateCustomer";
import CreateUserSchema from "../../../../../schemas/CreateUserSchema";
import Route from "../../../../Route";
import Server from "../../../../Server";

const repository = new InMemoryUserRepository()
const createCustomerUseCase = new CreateCustomer(repository)
const createCustomerController = new CreateCustomerController(createCustomerUseCase, CreateUserSchema)
const customerPresenter = new CustomerPresenter()

export default (server: Server) => {
  return [
    server.route(new Route(createCustomerController, customerPresenter))
  ]
}
