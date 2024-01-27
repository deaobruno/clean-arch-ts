export default interface ILoggerDriver {
  info(params: any): void;
  error(params: any): void;
  fatal(params: any): void;
}
