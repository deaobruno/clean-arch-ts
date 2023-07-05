import { expect } from 'chai'
import ExpressDriver from '../../../../src/infra/drivers/ExpressDriver'
import BaseRoute from '../../../../src/infra/http/BaseRoute'
import BaseController from '../../../../src/adapters/controllers/BaseController'
import BaseMiddleware from '../../../../src/adapters/middlewares/BaseMiddleware'

const server = new ExpressDriver(3031)

const useCase = {
  exec: (): Promise<void> => Promise.resolve()
}

class CustomController extends BaseController {}

const controller = new CustomController(useCase)

const presenter = {
  present: (data: any) => data
}

class CustomMiddleware extends BaseMiddleware {}

const middleware = new CustomMiddleware(useCase)

class Route extends BaseRoute {
  method
  statusCode

  constructor(method: string, path: string, statusCode: number) {
    super({ path, controller, presenter, middlewares: [middleware] })

    this.method = method
    this.statusCode = statusCode
  }
}

const routes = [
  new Route('get', '/test/get', 200),
  new Route('post', '/test/post', 201)
]

describe('/infra/drivers/ExpressDriver.ts', () => {
  it('should start the server passing an array of Routes', () => {
    const result = server.start(routes)

    expect(result).equal(undefined)
  })

  it('should stop the server', () => {
    const result = server.stop()

    expect(result).equal(undefined)
  })
})
