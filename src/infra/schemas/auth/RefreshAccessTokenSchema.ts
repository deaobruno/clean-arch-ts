export default {
  validate(payload: any): void | Error {
    const { refreshToken } = payload

    if (!refreshToken)
      return Error('"refreshToken" is required')

    const invalidParams = Object
      .keys(payload)
      .filter(key => !['refreshToken'].includes(key))
      .map(key => `"${ key }"`)
      .join(', ')
    
    if (invalidParams)
      return Error(`Invalid param(s): ${ invalidParams }`)
  }
}
