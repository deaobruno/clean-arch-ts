import { expect } from "chai"
import NotFoundError from '../../../../src/application/errors/NotFoundError'

describe('/application/errors/NotFoundError.ts', () => {
  it('shuold throw a Not Found Error', () => {
    expect(() => {
      throw new NotFoundError()
    }).throw('Not Found')
  })
})
