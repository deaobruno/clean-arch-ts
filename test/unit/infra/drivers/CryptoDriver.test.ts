import { expect } from 'chai'
import CryptoDriver from '../../../../src/infra/drivers/CryptoDriver'

const cryptoDriver = new CryptoDriver()

describe('/infra/drivers/CryptoDriver.ts', () => {
  it('should return an UUID', () => {
    expect(typeof cryptoDriver.generateID()).equal('string')
  })
})
