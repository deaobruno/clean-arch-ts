export default {
  validate(payload: any): void | Error {
    const { userId, email } = payload
    let error

    Object.keys(payload).forEach(key => {
      switch (key) {
        case 'userId':
          const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi

          if (userId && !uuidRegex.test(userId))
            error = new Error('Invalid "user_id" format')

          break

        case 'email':
          const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi

          if (!email)
            error = new Error('"email" is required')

          if (email && !emailRegex.test(email))
            error = new Error('Invalid "email" format')

          break
      
        default:
          error = new Error(`Invalid param: "${key}"`)
      }
    })

    return error
  }
}
