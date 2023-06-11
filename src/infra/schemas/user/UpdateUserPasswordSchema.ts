export default {
  validate(payload: any): void | Error {
    const { password, confirm_password } = payload

    if (!password)
      return new Error('"password" is required')

    if (!confirm_password)
      return new Error('"confirm_password" is required')

    if (password !== confirm_password)
      return new Error('Passwords mismatch')
  }
}
