export default {
  validate(payload: any): void | Error {
    const { userId, email } = payload
    const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

    if (!uuidRegex.test(userId))
      return Error('Invalid "user_id" format')

    if (email === '')
      return Error('"email" is required')

    if (email && !emailRegex.test(email))
      return Error('Invalid "email" format')

    const invalidParams = Object
      .keys(payload)
      .filter(key => !['userId', 'email'].includes(key))
      .map(key => `"${ key }"`)
      .join(', ')
    
    if (invalidParams)
      return Error(`Invalid param(s): ${ invalidParams }`)
  }
}
