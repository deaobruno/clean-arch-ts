import UseCase from '../../application/UseCase'

export default abstract class Middleware {
  constructor(protected _useCase: UseCase<any, any>) {}

  async handle(input: any): Promise<void> {
    return await this._useCase.exec(input)
  }
}
