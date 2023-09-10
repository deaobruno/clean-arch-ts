export default {
  validate(payload: any): void | Error {
    const { userId } = payload
    const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi

    if (!uuidRegex.test(userId))
      return Error('Invalid "user_id" format')

    const invalidParams = Object
      .keys(payload)
      .filter(key => !['userId'].includes(key))
      .map(key => `"${ key }"`)
      .join(', ')
    
    if (invalidParams)
      return Error(`Invalid param(s): ${ invalidParams }`)
  }
}
