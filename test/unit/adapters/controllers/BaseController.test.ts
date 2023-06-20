import { expect } from 'chai'
import BaseController from '../../../../src/adapters/controllers/BaseController'

class CustomController extends BaseController {
  constructor(dependencies: any) {
    super(dependencies)
  }
}

describe('/adapters/controllers/Controller.ts', () => {
  it('should return successfully without data', async () => {
    const useCase = {
      exec: async (data: any) => {
        return
      }
    }

    const customerController = new CustomController({ useCase })
    const result = await customerController.handle({ headers: {}, body: {}, query: {}, params: {} })

    expect(result).equal(undefined)
  })

  it('should return successfully with data', async () => {
    const body = { test: 'OK' }

    class CustomController extends BaseController {
      constructor(dependencies: any) {
        super(dependencies)
      }
    }

    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const customerController = new CustomController({ useCase })
    const result = await customerController.handle(body)

    expect(result).deep.equal(body)
  })

  it('should return successfully when more than 1 input is passed', async () => {
    const body = { test: 'OK' }
    const params = { id: 1 }

    class CustomController extends BaseController {
      constructor(dependencies: any) {
        super(dependencies)
      }
    }

    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const customerController = new CustomController({ useCase })
    const result = await customerController.handle({ ...body, ...params })

    expect(result).deep.equal({ ...body, ...params })
  })

  it('should fail when wrong input is passed', async () => {
    const body = { test: '' }

    class CustomController extends BaseController {
      constructor(dependencies: any) {
        super(dependencies)
      }
    }

    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const inputSchema = {
      validate: (payload: any) => {
        if (!payload.test) return new Error('"test" is required')
      }
    }
    const customerController = new CustomController({ useCase, inputSchema })

    await customerController.handle(body)
      .catch(error => {
        expect(error.message).equal('"test" is required')
      })
  })
})
