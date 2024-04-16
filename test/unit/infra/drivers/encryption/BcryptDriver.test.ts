import { expect } from 'chai'
import BcryptDriver from '../../../../../src/infra/drivers/encryption/BcryptDriver'

const bcryptDriver = new BcryptDriver()

describe('/src/infra/drivers/encryption/BcryptDriver.ts', () => {
  it('should return a hashed string using bcrypt algorithm', async () => {
    const hash = await bcryptDriver.encrypt('string')

    expect(typeof hash).equal('string')
  })

  it('should return a hashed string using bcrypt algorithm setting custom salt rounds', async () => {
    const hash = await bcryptDriver.encrypt('string', 5)

    expect(typeof hash).equal('string')
  })

  it('should return true when compared string is equal to hashed string', async () => {
    const hash = await bcryptDriver.encrypt('string')
    const result = await bcryptDriver.compare('string', hash)

    expect(result).equal(true)
  })

  it('should return false when compared string is equal to hashed string', async () => {
    const hash = await bcryptDriver.encrypt('string')
    const result = await bcryptDriver.compare('string2', hash)

    expect(result).equal(false)
  })
})
