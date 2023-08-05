import BaseError from './BaseError'

export default class BadRequestError extends BaseError {
  statusCode = 400

  constructor(message = 'Bad Request') {
    super(message)
  }
}
