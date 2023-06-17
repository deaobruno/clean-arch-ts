export default interface ISchema {
  validate: (payload: any) => void | Error
}
