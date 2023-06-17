import IUseCase from '../../application/IUseCase'

export default abstract class BaseMiddleware {
  constructor(protected _useCase: IUseCase<any, any>) {}

  async handle(input: any): Promise<void> {
    return this._useCase.exec(input)
  }
}
