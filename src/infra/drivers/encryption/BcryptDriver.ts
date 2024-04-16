import { hash, compare } from 'bcrypt';
import IEncryptionDriver from './IEncryptionDriver';

export default class BcryptDriver implements IEncryptionDriver {
  async encrypt(text: string, saltRounds = 10): Promise<string> {
    return hash(text, saltRounds);
  }

  async compare(text: string, hash: string): Promise<boolean> {
    return compare(text, hash);
  }
}
