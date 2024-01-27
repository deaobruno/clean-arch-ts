import crypto, { BinaryToTextEncoding } from "node:crypto";

export default class CryptoDriver {
  constructor() {}

  generateID(): string {
    return crypto.randomUUID();
  }

  hashString(
    text: string,
    algorithm = "sha256",
    encoding: BinaryToTextEncoding = "hex"
  ): string {
    return crypto.createHash(algorithm).update(text).digest(encoding);
  }
}
