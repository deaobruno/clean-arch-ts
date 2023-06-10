export default {
  validate(payload: any) {
    if (!payload.email) throw new Error('"email" is required')
    if (!payload.password) throw new Error('"password" is required')
    if (!payload.confirm_password) throw new Error('"confirm_password" is required')
  }
}
