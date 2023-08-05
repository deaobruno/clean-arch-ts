import BaseError from './BaseError'

export default class InternalServerError extends BaseError {
  statusCode = 500

  constructor(message = 'Internal Server Error') {
    super(message)
  }
}
