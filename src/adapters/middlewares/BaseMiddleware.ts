import IUseCase from '../../application/IUseCase'

export default abstract class BaseMiddleware {
  constructor(protected _useCase: IUseCase<any, any>) {}

  async handle(payload: any, headers?: any): Promise<any> {
    return this._useCase.exec(payload, headers)
  }
}
