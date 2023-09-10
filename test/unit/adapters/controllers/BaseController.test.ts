import { expect } from 'chai'
import BaseController from '../../../../src/adapters/controllers/BaseController'
import IUseCase from '../../../../src/application/useCases/IUseCase'
import ISchema from '../../../../src/infra/schemas/ISchema'
import BadRequestError from '../../../../src/application/errors/BadRequestError'

class CustomController extends BaseController {
  constructor(useCase: IUseCase<any, any>, schema?: ISchema) {
    super(useCase, schema)
  }
}

describe('/adapters/controllers/BaseController.ts', () => {
  it('should return successfully without data', async () => {
    const useCase = {
      exec: async (data: any) => {
        return
      }
    }
    const customerController = new CustomController(useCase)
    const result = await customerController.handle({ headers: {}, body: {}, query: {}, params: {} })

    expect(result).equal(undefined)
  })

  it('should return successfully with data', async () => {
    const body = { test: 'ok' }
    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const customerController = new CustomController(useCase)
    const result = await customerController.handle(body)

    expect(result).deep.equal(body)
  })

  it('should return successfully when more than 1 input is passed', async () => {
    const body = { test: 'ok' }
    const params = { id: 1 }
    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const customerController = new CustomController(useCase)
    const result = await customerController.handle({ ...body, ...params })

    expect(result).deep.equal({ ...body, ...params })
  })

  it('should return successfully when schema validation returns void', async () => {
    const body = { test: 'ok' }
    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const schema = {
      validate: () => undefined
    }
    const customerController = new CustomController(useCase, schema)
    const result = await customerController.handle(body)

    expect(result).deep.equal(body)
  })

  it('should return a BadRequestError when schema validation returns an error', async () => {
    const body = { test: 'ok' }
    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const schema = {
      validate: () => new Error('Error')
    }
    const customerController = new CustomController(useCase, schema)
    const error = await customerController.handle(body)

    expect(error instanceof BadRequestError).equal(true)
    expect(error.message).equal('Error')
    expect(error.statusCode).equal(400)
  })
})
