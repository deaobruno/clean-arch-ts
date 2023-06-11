import ApplicationError from './ApplicationError'

export default class NotFoundError extends ApplicationError {
  statusCode = 404

  constructor(message = 'Not Found') {
    super(message)
  }
}
