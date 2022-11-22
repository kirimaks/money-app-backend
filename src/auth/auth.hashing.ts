import crypto from 'crypto';

type HashAttributes = {
  keyBuff: Buffer;
  saltBuff: Buffer;
};

export class PasswordTool {
  private readonly saltLen = 16;
  private readonly keyLen = 32;
  private readonly keyIterations = 872791;
  private readonly digest = 'sha512';
  private readonly buffEncoding = 'base64';

  private createHash({ keyBuff, saltBuff }: HashAttributes): string {
    const hashBuff = Buffer.alloc(keyBuff.length + saltBuff.length + 8);

    hashBuff.writeUInt32BE(saltBuff.length, 0);
    hashBuff.writeUInt32BE(this.keyIterations, 4);

    saltBuff.copy(hashBuff, 8);
    keyBuff.copy(hashBuff, saltBuff.length + 8);

    return hashBuff.toString(this.buffEncoding);
  }

  async hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(this.saltLen, (saltError, saltBuff) => {
        if (saltError) {
          reject(saltError);
        }

        crypto.pbkdf2(
          password,
          saltBuff,
          this.keyIterations,
          this.keyLen,
          this.digest,
          (keyError, keyBuff) => {
            if (keyError) {
              reject(keyError);
            }

            const hash = this.createHash({
              keyBuff: keyBuff,
              saltBuff: saltBuff,
            });

            resolve(hash);
          },
        );
      });
    });
  }

  async validate(hashString: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const hashBuff: Buffer = Buffer.from(hashString, this.buffEncoding);

      const saltBytes = hashBuff.readUInt32BE(0);

      const keyBytes = hashBuff.length - saltBytes - 8;
      const iterations = hashBuff.readUInt32BE(4);

      const salt = hashBuff.slice(8, saltBytes + 8);
      const key = hashBuff.slice(8 + saltBytes, saltBytes + keyBytes + 8);

      crypto.pbkdf2(
        password,
        salt,
        iterations,
        keyBytes,
        this.digest,
        (keyError, keyBuff) => {
          if (keyError) {
            reject(keyError);
          }

          const newKey = keyBuff.toString('hex');
          resolve(newKey === key.toString('hex'));
        },
      );
    });
  }
}
