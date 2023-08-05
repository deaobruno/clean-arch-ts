import BaseError from './BaseError'

export default class ConflictError extends BaseError {
  statusCode = 409

  constructor(message = 'Conflict') {
    super(message)
  }
}
