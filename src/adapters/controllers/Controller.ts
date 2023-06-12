import Schema from '../../infra/schemas/Schema'
import UseCase from '../../application/UseCase'
import Presenter from '../presenters/Presenter'
import BadRequestError from '../../application/errors/BadRequestError'

export type ControllerOptions = {
  useCase: UseCase<any, any>
  inputSchema?: Schema
}

export default abstract class Controller {
  protected _useCase: UseCase<any, any>
  protected _inputSchema?: Schema
  protected _presenter?: Presenter

  constructor(options: ControllerOptions) {
    const {
      useCase,
      inputSchema,
    } = options

    this._useCase = useCase
    this._inputSchema = inputSchema
  }

  async handle(payload: any): Promise<any> {
    if (this._inputSchema) {
      const error = this._inputSchema.validate(payload)

      if (error instanceof Error)
        throw new BadRequestError(error.message)
    }

    return await this._useCase.exec(payload)
  }
}
