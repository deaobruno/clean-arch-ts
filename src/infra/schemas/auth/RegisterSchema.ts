import { RegisterInput } from "../../../application/use_cases/auth/Register"

export default {
  validate(payload: RegisterInput): void | Error {
    const { email, password, confirm_password } = payload
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

    if (!email)
      return new Error('"email" is required')

    if (!emailRegex.test(email))
      return new Error('Invalid "email" format')

    if (!password)
      return new Error('"password" is required')

    if (!confirm_password)
      return new Error('"confirm_password" is required')

    if (password !== confirm_password)
      return new Error('Passwords mismatch')
  }
}
