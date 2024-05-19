import { hash, compare } from 'bcrypt';
import IEncryptionDriver from './IEncryptionDriver';
import ILoggerDriver from '../logger/ILoggerDriver';

export default class BcryptDriver implements IEncryptionDriver {
  constructor(private logger: ILoggerDriver) {}

  async encrypt(password: string, saltRounds = 10): Promise<string> {
    const encrypted = await hash(password, saltRounds);

    this.logger.debug({
      message: '[BcryptDriver] Password encrypted',
      password,
      saltRounds,
      encrypted,
    });

    return encrypted;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const comparison = await compare(password, hash);

    this.logger.debug({
      message: '[BcryptDriver] Password comparison',
      password,
      hash,
      comparison,
    });

    return comparison;
  }
}
