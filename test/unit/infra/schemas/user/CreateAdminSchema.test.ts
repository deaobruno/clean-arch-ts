import { faker } from '@faker-js/faker'
import { expect } from 'chai'
import CreateAdminSchema from '../../../../../src/infra/schemas/user/CreateAdminSchema'

const { validate } = CreateAdminSchema

describe('/infra/schemas/user/CreateAdminSchema.ts', () => {
  it('should execute without errors', () => {
    const validation = validate({
      email: faker.internet.email(),
      password: 'test',
      confirm_password: 'test',
    })

    expect(validation).equal(undefined)
  })

  it('should fail when missing email', () => {
    const validation = <Error>validate({
      email: '',
      password: 'test',
      confirm_password: 'test',
    })

    expect(validation.message).equal('"email" is required')
  })

  it('should fail when passing invalid email', () => {
    const validation = <Error>validate({
      email: 'test',
      password: 'test',
      confirm_password: 'test',
    })

    expect(validation.message).equal('Invalid "email" format')
  })

  it('should fail when missing password', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: '',
      confirm_password: 'test',
    })

    expect(validation.message).equal('"password" is required')
  })

  it('should fail when missing confirm_password', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: 'test',
      confirm_password: '',
    })

    expect(validation.message).equal('"confirm_password" is required')
  })

  it('should fail when password and confirm_password are different', () => {
    const validation = <Error>validate({
      email: faker.internet.email(),
      password: 'test',
      confirm_password: 'tes',
    })

    expect(validation.message).equal('Passwords mismatch')
  })
})
