export default {
  validate(payload: any): void | Error {
    const { userId } = payload
    let error

    const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi

    if (!uuidRegex.test(userId))
      error = new Error('Invalid "user_id" format')

    return error
  }
}
