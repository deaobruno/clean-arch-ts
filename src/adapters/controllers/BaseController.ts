import IUseCase from '../../application/IUseCase'

export default abstract class BaseController {
  constructor(protected _useCase: IUseCase<any, any>) {}

  async handle(payload: any): Promise<any> {
    return this._useCase.exec(payload)
  }
}
