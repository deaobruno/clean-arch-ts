import { expect } from 'chai'
import LogoutSchema from '../../../../../src/infra/schemas/auth/LogoutSchema'

const { validate } = LogoutSchema

describe('/infra/schemas/auth/LogoutSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      refreshToken: 'test',
    })

    expect(validation).equal(undefined)
  })

  it('should fail when refreshToken is empty', () => {
    const validation = <Error>validate({
      refreshToken: '',
    })

    expect(validation.message).equal('"refreshToken" is required')
  })
})
