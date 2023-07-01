import ISchema from '../../infra/schemas/ISchema'
import IUseCase from '../../application/IUseCase'
import BadRequestError from '../../application/errors/BadRequestError'

export type ControllerOptions = {
  useCase: IUseCase<any, any>
  headersSchema?: ISchema
  payloadSchema?: ISchema
}

export default abstract class BaseController {
  protected _useCase: IUseCase<any, any>
  protected _headersSchema?: ISchema
  protected _payloadSchema?: ISchema

  constructor(options: ControllerOptions) {
    const {
      useCase,
      headersSchema,
      payloadSchema,
    } = options

    this._useCase = useCase
    this._headersSchema = headersSchema
    this._payloadSchema = payloadSchema
  }

  async handle(body: any, headers?: any): Promise<any> {
    const { user, ...payload } = body

    if (this._headersSchema) {
      const validation = this._headersSchema.validate(payload)

      if (validation instanceof Error)
        throw new BadRequestError(validation.message)
    }

    if (this._payloadSchema) {
      const validation = this._payloadSchema.validate(payload)

      if (validation instanceof Error)
        throw new BadRequestError(validation.message)
    }

    return this._useCase.exec({ ...payload, ...headers })
  }
}
