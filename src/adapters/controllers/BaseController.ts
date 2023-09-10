import BadRequestError from '../../application/errors/BadRequestError'
import IUseCase from '../../application/useCases/IUseCase'
import ISchema from '../../infra/schemas/ISchema'

export default abstract class BaseController {
  constructor(
    private _useCase: IUseCase<any, any>,
    private _schema?: ISchema,
  ) {}

  async handle(payload: any): Promise<any> {
    delete payload.user

    const error = this._schema?.validate(payload)

    if (error)
      return new BadRequestError(error.message)

    return this._useCase.exec(payload)
  }
}
