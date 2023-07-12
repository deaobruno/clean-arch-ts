import { expect } from 'chai'
import RefreshAccessTokenSchema from '../../../../../src/infra/schemas/auth/RefreshAccessTokenSchema'

const { validate } = RefreshAccessTokenSchema

describe('/infra/schemas/auth/RefreshAccessTokenSchema.ts', () => {
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
