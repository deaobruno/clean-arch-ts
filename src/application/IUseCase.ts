export default interface IUseCase<T, U> {
  exec(input: T, headers?: any): Promise<U>
}
