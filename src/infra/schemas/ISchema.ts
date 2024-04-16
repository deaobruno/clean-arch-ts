export default interface ISchema {
  validate: (payload: unknown) => void | Error;
}
