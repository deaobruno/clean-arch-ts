import { expect } from 'chai'
import ValidateInput from '../../../../../src/application/use_cases/validation/ValidateInput'
import BadRequestError from '../../../../../src/application/errors/BadRequestError'

const schema = {
  validate: (input: any) => {
    if (!input.test)
      return new Error('Empty "test"')

    if (input.test !== 'test')
      return new Error('Invalid "test"')
  }
}
const validateInput = new ValidateInput(schema)

describe('/application/use_cases/validation/ValidateInput.ts', () => {
  it('should return void when input is valid', () => {
    expect(validateInput.exec({ test: 'test' })).equal(undefined)
  })

  it('should return a BadRequestError when input is empty', () => {
    const error = <any>validateInput.exec({ tes: 'test' })

    expect(error instanceof BadRequestError).equal(true)
    expect(error.message).equal('Empty "test"')
    expect(error.statusCode).equal(400)
  })

  it('should return a BadRequestError when input is invalid', () => {
    const error = <any>validateInput.exec({ test: 'tes' })

    expect(error instanceof BadRequestError).equal(true)
    expect(error.message).equal('Invalid "test"')
    expect(error.statusCode).equal(400)
  })
})
