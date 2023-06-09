import { expect } from 'chai'
import CreateUserSchema from '../../../../src/infra/schemas/CreateUserSchema'

const { validate } = CreateUserSchema

describe('/infra/schemas/CreateUserSchema.ts', () => {
  it('should execute without errors', () => {
    validate({
      email: 'test',
      password: 'test',
      confirm_password: 'test',
    })

    expect(true)
  })

  it('should fail when missing email', () => {
    expect(() => validate({
      email: '',
      password: 'test',
      confirm_password: 'test',
    }))
      .throw('"email" is required')
  })

  it('should fail when missing password', () => {
    expect(() => validate({
      email: 'test',
      password: '',
      confirm_password: 'test',
    }))
      .throw('"password" is required')
  })

  it('should fail when missing confirm_password', () => {
    expect(() => validate({
      email: 'test',
      password: 'test',
      confirm_password: '',
    }))
      .throw('"confirm_password" is required')
  })
})
