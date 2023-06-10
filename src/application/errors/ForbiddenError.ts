import ApplicationError from './ApplicationError'

export default class ForbiddenError extends ApplicationError {
  statusCode = 403

  constructor(message = 'Forbidden') {
    super(message)
  }
}
