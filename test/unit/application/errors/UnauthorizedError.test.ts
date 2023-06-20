import { expect } from "chai"
import UnauthorizedError from '../../../../src/application/errors/UnauthorizedError'

describe('/application/errors/UnauthorizedError.ts', () => {
  it('shuold throw a Unauthorized Error', () => {
    expect(() => {
      throw new UnauthorizedError()
    }).throw('Unauthorized')
  })
})
