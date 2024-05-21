import crypto, { BinaryToTextEncoding } from 'node:crypto';
import ILoggerDriver from '../logger/ILoggerDriver';

export default class CryptoDriver {
  constructor(private logger: ILoggerDriver) {}

  generateID(): string {
    const uuid = crypto.randomUUID();

    this.logger.debug({
      message: '[CryptoDriver] UUID generated',
      uuid,
    });

    return uuid;
  }

  hashString(
    text: string,
    algorithm = 'sha256',
    encoding: BinaryToTextEncoding = 'hex',
  ): string {
    const hash = crypto.createHash(algorithm).update(text).digest(encoding);

    this.logger.debug({
      message: '[CryptoDriver] String hashed',
      text,
      algorithm,
      encoding,
      hash,
    });

    return hash;
  }
}
