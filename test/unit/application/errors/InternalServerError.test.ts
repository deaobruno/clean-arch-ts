import { expect } from "chai"
import InternalServerError from '../../../../src/application/errors/InternalServerError'

describe('/application/errors/InternalServerError.ts', () => {
  it('shuold throw a Internal Server Error Error', () => {
    expect(() => {
      throw new InternalServerError()
    }).throw('Internal Server Error')
  })
})
