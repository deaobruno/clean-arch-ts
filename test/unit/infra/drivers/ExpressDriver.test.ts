import { expect } from 'chai'
import ExpressDriver from '../../../../src/infra/drivers/server/ExpressDriver'
import BaseController from '../../../../src/adapters/controllers/BaseController'
import dependencies from '../../../../src/dependencies'
import config from '../../../../src/config'

const dependenciesContainer = dependencies(config)
const {
  drivers: {
    httpServerDriver,
  },
} = dependenciesContainer
const { get, post } = httpServerDriver

const useCase = {
  exec: (): Promise<void> => Promise.resolve()
}

class GetController extends BaseController {
  statusCode = 200
}

class PostController extends BaseController {
  statusCode = 201
}

const getController = new GetController({ useCase })
const postController = new PostController({ useCase })

const routes = [
  get('/test/get', getController),
  post('/test/post', postController)
]

describe('/infra/drivers/ExpressDriver.ts', () => {
  it('should start the server passing an array of Routes', () => {
    const result = httpServerDriver.start(3031, routes)

    expect(result).equal(undefined)
  })

  it('should stop the server', () => {
    const result = httpServerDriver.stop()

    expect(result).equal(undefined)
  })
})
