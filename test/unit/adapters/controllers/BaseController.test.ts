import { expect } from 'chai'
import BaseController from '../../../../src/adapters/controllers/BaseController'
import IUseCase from '../../../../src/application/IUseCase'

class CustomController extends BaseController {
  constructor(useCase: IUseCase<any, any>) {
    super(useCase)
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
    const body = { test: 'OK' }

    class CustomController extends BaseController {
      constructor(useCase: IUseCase<any, any>) {
        super(useCase)
      }
    }

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
    const body = { test: 'OK' }
    const params = { id: 1 }

    class CustomController extends BaseController {
      constructor(useCase: IUseCase<any, any>) {
        super(useCase)
      }
    }

    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const customerController = new CustomController(useCase)
    const result = await customerController.handle({ ...body, ...params })

    expect(result).deep.equal({ ...body, ...params })
  })
})
