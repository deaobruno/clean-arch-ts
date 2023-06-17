import BaseError from './BaseError'

export default class NotFoundError extends BaseError {
  statusCode = 404

  constructor(message = 'Not Found') {
    super(message)
  }
}
