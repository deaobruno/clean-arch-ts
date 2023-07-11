import IUseCase from '../../application/IUseCase'

export default abstract class BaseMiddleware {
  constructor(protected _useCase: IUseCase<any, any>) {}

  protected formatInput(payload: any, headers?: any) {
    return { ...payload, ...headers }
  }

  async handle(payload: any, headers: any): Promise<any> {
    return this._useCase.exec(this.formatInput(payload, headers))
  }
}
