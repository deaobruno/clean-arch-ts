export default {
  validate(payload: any) {
    Object.keys(payload).forEach(key => {
      switch (key) {
        case 'email':
          const { email } = payload

          if (!email) throw new Error('"email" is empty')
          if (typeof email !== 'string') throw new Error('"email" must be a string')

          break
      
        default:
          throw new Error(`Invalid search param: ${key}`)
      }
    })
  }
}
