import { expect } from 'chai'
import BaseController from '../../../../src/adapters/controllers/BaseController'
import BaseRoute from '../../../../src/infra/http/BaseRoute'
import IPresenter from '../../../../src/adapters/presenters/IPresenter'

class CustomController extends BaseController {}

class CustomRoute extends BaseRoute {
  method = 'get'
  statusCode = 200

  constructor(controller: BaseController, presenter?: IPresenter) {
    const routeConfig = {
      path: '/test',
      controller,
      presenter,
    }

    super(routeConfig)
  }
}

const useCase = {
  exec: (data: any): Promise<void> => Promise.resolve(data)
}
const controller = new CustomController(useCase)
const presenter = {
  present(data: any) {
    const { test } = data

    return { test }
  }
}

describe('/infra/http/routes/BaseRoute.ts', () => {
  it('should return a single object equal to payload when no presenter is passed', async () => {
    const route = new CustomRoute(controller)
    const data = { test: 'test' }

    expect(await route.handle(data)).equal(data)
  })

  it('should return a single object formatted by presenter', async () => {
    const route = new CustomRoute(controller, presenter)
    const data = { test: 'test', invalid: false }

    expect(await route.handle(data)).deep.equal({ test: 'test' })
  })

  it('should return an array of objects formatted by presenter', async () => {
    const route = new CustomRoute(controller, presenter)
    const data = { test: 'test', invalid: false }
    const result = await route.handle([data, data, data])

    expect(result[0]).deep.equal({ test: 'test' })
    expect(result[1]).deep.equal({ test: 'test' })
    expect(result[2]).deep.equal({ test: 'test' })
  })
})
