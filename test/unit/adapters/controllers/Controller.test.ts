import { expect } from 'chai'
import Controller from '../../../../src/adapters/controllers/Controller'

describe('/adapters/controllers/Controller.ts', () => {
  it('should return a successful HttpResponse object without data', async () => {
    const statusCode = 200

    class CustomController extends Controller {
      constructor(dependencies: any) {
        super({ ...dependencies, statusCode })
      }
    }

    const useCase = {
      exec: async (data: any) => {
        return
      }
    }
    const customerController = new CustomController({ useCase })
    const result = await customerController.handle({ headers: {}, body: {}, query: {}, params: {} })

    expect(result.statusCode).equal(statusCode)
    expect(result.response).equal(undefined)
  })

  it('should return a successful HttpResponse object with data', async () => {
    const statusCode = 200
    const body = { test: 'OK' }

    class CustomController extends Controller {
      constructor(dependencies: any) {
        super({ ...dependencies, statusCode })
      }
    }

    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const customerController = new CustomController({ useCase })
    const result = await customerController.handle(body)

    expect(result.statusCode).equal(statusCode)
    expect(result.response).deep.equal(body)
  })

  it.skip('should return a successful HttpResponse object with single formatted data', async () => {
    const statusCode = 200
    const body = { test: 'OK' }

    class CustomController extends Controller {
      constructor(dependencies: any) {
        super({ ...dependencies, statusCode })
      }
    }

    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const presenter = {
      present: (data: typeof body) => {
        data.test = data.test.toLowerCase()

        return data
      }
    }
    const customerController = new CustomController({ useCase, presenter })
    const result = await customerController.handle({ headers: {}, body, query: {}, params: {} })

    expect(result.statusCode).equal(statusCode)
    expect(result.response.test).deep.equal(body.test.toLowerCase())
  })

  it.skip('should return a successful HttpResponse object with multiple formatted data', async () => {
    const statusCode = 200
    const body = [{ test: 'OK' }, { test: 'OK' }]

    class CustomController extends Controller {
      constructor(dependencies: any) {
        super({ ...dependencies, statusCode })
      }
    }

    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const presenter = {
      present: (data: typeof body[0]) => {
        data.test = data.test.toLowerCase()

        return data
      }
    }
    const customerController = new CustomController({ useCase, presenter })
    const result = await customerController.handle({ headers: {}, body, query: {}, params: {} })

    expect(result.statusCode).equal(statusCode)
    expect(result.response).deep.equal(body.map(presenter.present))
  })

  it('should return a successful HttpResponse object when more than 1 input is passed', async () => {
    const statusCode = 200
    const body = { test: 'OK' }
    const params = { id: 1 }

    class CustomController extends Controller {
      constructor(dependencies: any) {
        super({ ...dependencies, statusCode })
      }
    }

    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const customerController = new CustomController({ useCase })
    const result = await customerController.handle({ ...body, ...params })

    expect(result.statusCode).equal(statusCode)
    expect(result.response).deep.equal({ ...body, ...params })
  })

  it('should fail when wrong input is passed', async () => {
    const statusCode = 200
    const body = { test: '' }

    class CustomController extends Controller {
      constructor(dependencies: any) {
        super({ ...dependencies, statusCode })
      }
    }

    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }
    const inputSchema = {
      validate: async (payload: any) => {
        if (!payload.test) throw new Error('"test" is required')
      }
    }
    const customerController = new CustomController({ useCase, inputSchema })

    await customerController.handle(body)
      .catch(error => {
        expect(error.message).equal('"test" is required')
      })
  })
})
