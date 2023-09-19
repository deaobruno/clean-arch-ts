export default {
  validate(payload: any): void | Error {
    const { user_id, password, confirm_password } = payload
    const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi

    if (!uuidRegex.test(user_id))
      return Error('Invalid "user_id" format')

    if (!password)
      return Error('"password" is required')

    if (!confirm_password)
      return Error('"confirm_password" is required')

    if (password && confirm_password && (password !== confirm_password))
      return Error('Passwords mismatch')

    const invalidParams = Object
      .keys(payload)
      .filter(key => !['user_id', 'password', 'confirm_password'].includes(key))
      .map(key => `"${ key }"`)
      .join(', ')
    
    if (invalidParams)
      return Error(`Invalid param(s): ${ invalidParams }`)
  }
}
