import { expect } from 'chai'
import BaseMiddleware from '../../../../src/adapters/middlewares/BaseMiddleware'

class CustomMiddleware extends BaseMiddleware {}

describe('/adapters/middlewares/BaseMiddleware.ts', () => {
  it('should execute a middleware and return the result of an use case', async () => {
    const useCase = {
      exec: async (data: any) => {
        return data
      }
    }

    const middleware = new CustomMiddleware(useCase)
    const data = { teste: 'ok' }
    const result = await middleware.handle(data, {})

    expect(result).deep.equal(data)
  })
})