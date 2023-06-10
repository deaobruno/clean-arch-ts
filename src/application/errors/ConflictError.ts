import ApplicationError from './ApplicationError'

export default class ConflictError extends ApplicationError {
  statusCode = 409

  constructor(message = 'Conflict') {
    super(message)
  }
}
