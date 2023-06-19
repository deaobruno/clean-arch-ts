import ISchema from '../../infra/schemas/ISchema'
import IUseCase from '../../application/IUseCase'
import BadRequestError from '../../application/errors/BadRequestError'

export type ControllerOptions = {
  useCase: IUseCase<any, any>
  inputSchema?: ISchema
}

export default abstract class BaseController {
  protected _useCase: IUseCase<any, any>
  protected _inputSchema?: ISchema

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
      const validation = this._inputSchema.validate(payload)

      if (validation instanceof Error)
        throw new BadRequestError(validation.message)
    }

    return this._useCase.exec(payload)
  }
}
