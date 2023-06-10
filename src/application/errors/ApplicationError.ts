export default abstract class ApplicationError extends Error {
  abstract statusCode: number
}
