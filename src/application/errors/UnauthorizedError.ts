import BaseError from './BaseError'

export default class UnauthorizedError extends BaseError {
  statusCode = 401

  constructor(message = 'Unauthorized') {
    super(message)
  }
}
