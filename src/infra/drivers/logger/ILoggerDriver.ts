export default interface ILoggerDriver {
  info(params: unknown): void;
  error(params: unknown): void;
  fatal(params: unknown): void;
}
