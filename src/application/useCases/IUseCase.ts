export default interface IUseCase<T, U> {
  exec(payload: T): U | Promise<U>
}
