export default {
  validate(payload: any): void | Error {
    const { refreshToken } = payload
    let error

    if (!refreshToken)
      error = new Error('"refreshToken" is required')

    return error
  }
}
