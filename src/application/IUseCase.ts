export default interface IUseCase<T, U> {
  exec(payload: T, headers?: any): U | Promise<U>
}
