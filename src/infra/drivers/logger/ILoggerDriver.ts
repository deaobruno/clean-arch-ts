export default interface ILoggerDriver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(data: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(data: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(data: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(data: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fatal(data: any): void;
  obfuscate(text: string, start?: number, end?: number, char?: string): string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obfuscateData(data: any): any;
}
