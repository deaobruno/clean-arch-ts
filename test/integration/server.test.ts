import axios from 'axios'
import { expect } from 'chai'
import config from '../../src/config'
import dependencies from '../../src/dependencies'
import BaseController from '../../src/adapters/controllers/BaseController'
import IUseCase from '../../src/application/useCases/IUseCase'
import ControllerConfig from '../../src/adapters/controllers/ControllerConfig'

const dependenciesContainer = dependencies(config)
const {
  drivers: {
    httpServerDriver,
  },
} = dependenciesContainer

const customUseCase = {
  exec: async (data: any) => data
}

const errorUseCase = {
  exec: async () => {
    throw new Error()
  }
}

class CustomController extends BaseController {
  statusCode = 200

  constructor(config: ControllerConfig<IUseCase<any, any>>) {
    super(config)
  }
}

describe('server', () => {
  before(() => {
    const { get } = httpServerDriver
    const routes = [
      get('/error', new CustomController({ useCase: errorUseCase })),
      get('/middleware', new CustomController({ useCase: customUseCase })),
      get('/error-middleware', new CustomController({ useCase: customUseCase })),
    ]

    httpServerDriver.start(3031, routes)
  })

  after(() => httpServerDriver.stop())

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
