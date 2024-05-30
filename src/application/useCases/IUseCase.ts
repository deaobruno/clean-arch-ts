export default interface IUseCase<T, U> {
  exec(input: T): U | Promise<U>;
}
