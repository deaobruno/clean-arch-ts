import Schema from '../../infra/schemas/Schema'
import UseCase from '../../application/UseCase'
import Presenter from '../presenters/Presenter'
import BadRequestError from '../../application/errors/BadRequestError'

export type ControllerOptions = {
  useCase: UseCase
  inputSchema?: Schema
  statusCode: number
}

export default abstract class Controller {
  protected _useCase: UseCase
  protected _inputSchema?: Schema
  protected _presenter?: Presenter
  protected _statusCode: number

  constructor(options: ControllerOptions) {
    const {
      useCase,
      inputSchema,
      statusCode,
    } = options

    this._useCase = useCase
    this._inputSchema = inputSchema
    this._statusCode = statusCode
  }

  async handle(payload: any): Promise<any> {
    if (this._inputSchema) {
      const error = this._inputSchema.validate(payload)

      if (error instanceof Error)
        throw new BadRequestError(error.message)
    }

    const response = await this._useCase.exec(payload)

    return {
      statusCode: this._statusCode,
      response,
    }
  }
}
