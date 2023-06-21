import { UpdateUserPasswordInput } from "../../../application/use_cases/user/UpdateUserPassword"

export default {
  validate(payload: UpdateUserPasswordInput): void | Error {
    const { password, confirm_password } = payload

    if (!password)
      return new Error('"password" is required')

    if (!confirm_password)
      return new Error('"confirm_password" is required')

    if (password !== confirm_password)
      return new Error('Passwords mismatch')
  }
}
