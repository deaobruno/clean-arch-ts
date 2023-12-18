import crypto from "node:crypto";

export default class CryptoDriver {
  constructor() {}

  generateID(): string {
    return crypto.randomUUID();
  }

  hashString(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex");
  }
}
