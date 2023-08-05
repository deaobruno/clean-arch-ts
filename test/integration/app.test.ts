import axios from 'axios'
import { expect } from 'chai'
import ExpressDriver from '../../src/infra/drivers/server/ExpressDriver'
import httpRoutes from '../../src/infra/http/v1/routes'
import BaseRoute from '../../src/infra/http/v1/routes/BaseRoute'
import BaseController from '../../src/adapters/controllers/BaseController'
import IUseCase from '../../src/application/useCases/IUseCase'
import BaseMiddleware from '../../src/adapters/middlewares/BaseMiddleware'

const { routes } = httpRoutes
const server = new ExpressDriver(3031)

const customUseCase = {
  exec: async (data: any) => data
}

const errorUseCase = {
  exec: async () => {
    throw new Error()
  }
}

class CustomMiddleware extends BaseMiddleware {
  constructor(useCase: IUseCase<any, any>) {
    super(useCase)
  }
}

class CustomController extends BaseController {
  constructor(useCase: IUseCase<any, any>) {
    super(useCase)
  }
}

class CustomRoute extends BaseRoute {
  method = 'get'
  statusCode = 200

  constructor(path: string, controller: CustomController, middlewares?: BaseMiddleware[]) {
    super({ path, controller, middlewares })
  }
}

describe('server', () => {
  before(() => {
    const errorRoute = new CustomRoute('/error', new CustomController(errorUseCase))
    const middlewareRoute = new CustomRoute(
      '/middleware',
      new CustomController(customUseCase),
      [new CustomMiddleware(customUseCase)]
    )
    const errorMiddlewareRoute = new CustomRoute(
      '/error-middleware',
      new CustomController(customUseCase),
      [new CustomMiddleware(errorUseCase)]
    )

    routes.push(errorRoute)
    routes.push(middlewareRoute)
    routes.push(errorMiddlewareRoute)
    server.start(routes)
  })

  after(() => {
    routes.pop()
    routes.pop()
    routes.pop()
    server.stop()
  })

  it('should get status 404 when trying to send request to invalid URL', async () => {
    await axios.get('http://localhost:3031/test')
      .catch(({ response: { status, data } }) => {
        expect(status).equal(404)
        expect(data.error).equal('Invalid URL')
    })
  })

  it('should get status 500 when trying to access route with error', async () => {
    await axios.get('http://localhost:3031/error')
      .catch(({ response: { status, data } }) => {
        expect(status).equal(500)
        expect(data.error).equal('Internal Server Error')
    })
  })

  it('should get status 200 when trying to access route with middleware', async () => {
    const { status, data } = await axios.get('http://localhost:3031/middleware?test=test')

    expect(status).equal(200)
    expect(data).deep.equal({ test: 'test' })
  })

  it('should get status 500 when trying to access route with middleware with error', async () => {
    await axios.get('http://localhost:3031/error-middleware')
      .catch(({ response: { status, data } }) => {
        expect(status).equal(500)
        expect(data.error).equal('Internal Server Error')
    })
  })
})
