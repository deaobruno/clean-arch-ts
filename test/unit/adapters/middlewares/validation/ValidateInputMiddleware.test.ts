import sinon from 'sinon'
import { expect } from 'chai'
import ValidateInputMiddleware from '../../../../../src/adapters/middlewares/validation/ValidateInputMiddleware'
import ValidateInput from '../../../../../src/application/useCases/validation/ValidateInput'

describe('/src/adapters/middlewares/auth/ValidateInputMiddleware.ts', () => {
  it('should return void when passing an admin User in payload', async () => {
    const schema = {
      validate: () => undefined
    }
    const validateInputUseCase = new ValidateInput(schema)
    const validateInputMiddleware = new ValidateInputMiddleware(validateInputUseCase)

    sinon
      .stub(validateInputUseCase, 'exec')
      .resolves()

    const result = await validateInputMiddleware.handle({ test: 'ok' }, {})

    expect(result).deep.equal(undefined)
  })
})
