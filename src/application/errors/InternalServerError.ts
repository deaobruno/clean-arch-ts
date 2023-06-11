import ApplicationError from './ApplicationError'

export default class InternalServerError extends ApplicationError {
  statusCode = 500

  constructor(message = 'Internal Server Error') {
    super(message)
  }
}
