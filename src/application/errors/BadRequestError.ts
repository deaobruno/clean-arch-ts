import ApplicationError from './ApplicationError'

export default class BadRequestError extends ApplicationError {
  statusCode = 400

  constructor(message = 'Bad Request') {
    super(message)
  }
}
