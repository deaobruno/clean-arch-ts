export default {
  validate(payload: any): void | Error {
    const { refresh_token } = payload

    if (!refresh_token)
      return Error('"refresh_token" is required')

    const invalidParams = Object
      .keys(payload)
      .filter(key => !['refresh_token'].includes(key))
      .map(key => `"${ key }"`)
      .join(', ')
    
    if (invalidParams)
      return Error(`Invalid param(s): ${ invalidParams }`)
  }
}
