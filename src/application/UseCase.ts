export default interface UseCase<T, U> {
  exec(input: T): Promise<U>
}
