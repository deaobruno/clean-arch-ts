import BaseError from './BaseError'

export default class ForbiddenError extends BaseError {
  statusCode = 403

  constructor(message = 'Forbidden') {
    super(message)
  }
}
