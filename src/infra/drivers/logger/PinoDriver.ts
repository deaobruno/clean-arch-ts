import pino from 'pino';
import ILoggerDriver from './ILoggerDriver';
import EventEmitter from 'events';

export default class PinoDriver extends EventEmitter implements ILoggerDriver {
  constructor(
    level: string,
    private logger = pino({
      level,
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level,
            options: {
              translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
            },
          },
        ],
      },
    }),
  ) {
    super();

    this.on('debug', (data) => this.logger.debug(data));
    this.on('info', (data) => this.logger.info(data));
    this.on('warn', (data) => this.logger.warn(data));
    this.on('error', (data) => this.logger.error(data));
    this.on('fatal', (data) => this.logger.fatal(data));
  }

  private setMessage(data: unknown): void {
    if (data && typeof data === 'object' && data['message']) {
      data['msg'] = data['message'];
      delete data['message'];
    }
  }

  obfuscate(text: string, start = 0, end = 0, char = '*'): string {
    const textLength = text.length;

    if (start < 0 || start > textLength) start = 0;
    if (end < 0 || end > textLength) end = 0;
    if (start === 0 && end === 0) return char.repeat(textLength);

    const prefix = char.repeat(start);
    const suffix = char.repeat(end);

    text = prefix + text.substring(start);
    text = text.substring(0, textLength - end) + suffix;

    return text;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obfuscateData(data: any): void {
    if (typeof data !== 'object') return data;

    Object.keys(data).forEach((attribute) => {
      const value = data[attribute];

      if (!value) return;
      if (typeof value === 'object') return this.obfuscateData(value);

      switch (attribute) {
        case 'password':
        case 'confirm_password':
          data[attribute] = this.obfuscate(value);
          break;

        case 'email':
          data[attribute] = this.obfuscate(value, value.indexOf('@'));
          break;

        default:
          break;
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(data: any): void {
    if (typeof data === 'object') data = JSON.parse(JSON.stringify(data));

    this.setMessage(data);
    this.obfuscateData(data);
    this.emit('debug', data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(data: any): void {
    if (typeof data === 'object') data = JSON.parse(JSON.stringify(data));

    this.setMessage(data);
    this.obfuscateData(data);
    this.emit('info', data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(data: any): void {
    if (typeof data === 'object') data = JSON.parse(JSON.stringify(data));

    this.setMessage(data);
    this.obfuscateData(data);
    this.emit('warn', data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(data: any): void {
    if (typeof data === 'object') data = JSON.parse(JSON.stringify(data));

    this.setMessage(data);
    this.obfuscateData(data);
    this.emit('error', data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fatal(data: any): void {
    if (typeof data === 'object') data = JSON.parse(JSON.stringify(data));

    this.setMessage(data);
    this.obfuscateData(data);
    this.emit('fatal', data);
  }
}
