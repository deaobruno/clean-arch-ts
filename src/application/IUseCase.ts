export default interface IUseCase<T, U> {
  exec(input: T): Promise<U>
}
