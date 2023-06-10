import ApplicationError from './ApplicationError'

export default class UnauthorizedError extends ApplicationError {
  statusCode = 401

  constructor(message = 'Unauthorized') {
    super(message)
  }
}
