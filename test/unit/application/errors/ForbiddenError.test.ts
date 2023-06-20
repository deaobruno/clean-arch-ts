import { expect } from "chai"
import ForbiddenError from '../../../../src/application/errors/ForbiddenError'

describe('/application/errors/ForbiddenError.ts', () => {
  it('shuold throw a Forbidden Error', () => {
    expect(() => {
      throw new ForbiddenError()
    }).throw('Forbidden')
  })
})
