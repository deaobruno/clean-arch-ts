export default {
  validate(request: any) {
    if (!request.email) throw new Error('"email" is required')
    if (!request.password) throw new Error('"password" is required')
    if (!request.confirm_password) throw new Error('"confirm_password" is required')
  }
}
