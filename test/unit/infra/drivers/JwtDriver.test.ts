import { expect } from 'chai'
import JwtDriver from '../../../../src/infra/drivers/JwtDriver'

const jwtDriver = new JwtDriver('key', 60)
const tokenData = { test: true }
let accessToken: string

describe('/infra/drivers/JwtDriver.ts', () => {
  it('should generate a JWT token passing an object with data', () => {
    accessToken = jwtDriver.generate(tokenData)

    expect(typeof accessToken).equal('string')
  })
  
  it('should return the data from a JWT token', () => {
    const data = jwtDriver.validate(accessToken)

    expect(data).deep.equal(tokenData)
  })
})
