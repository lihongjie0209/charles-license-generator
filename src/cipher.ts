/**
 * RC5-like cipher implementation for Charles license key generation
 */

const ROUNDS = 12;
const ROUND_KEYS = 2 * (ROUNDS + 1);

export class CkCipher {
  private rk: Int32Array;

  constructor(ckKey: bigint) {
    this.rk = new Int32Array(ROUND_KEYS);
    this.initializeRoundKeys(ckKey);
  }

  private initializeRoundKeys(ckKey: bigint): void {
    const ld = new Int32Array(2);
    ld[0] = Number(ckKey & 0xffffffffn);
    ld[1] = Number((ckKey >> 32n) & 0xffffffffn);

    this.rk[0] = -1209970333;
    for (let i = 1; i < ROUND_KEYS; i++) {
      this.rk[i] = this.rk[i - 1] + -1640531527;
    }

    let a = 0, b = 0;
    let i = 0, j = 0;

    for (let k = 0; k < 3 * ROUND_KEYS; k++) {
      this.rk[i] = this.rotateLeft(this.rk[i] + (a + b), 3);
      a = this.rk[i];
      ld[j] = this.rotateLeft(ld[j] + (a + b), a + b);
      b = ld[j];
      i = (i + 1) % ROUND_KEYS;
      j = (j + 1) % 2;
    }
  }

  encrypt(input: bigint): bigint {
    let a = Number(input & 0xffffffffn) + this.rk[0];
    let b = Number((input >> 32n) & 0xffffffffn) + this.rk[1];

    for (let r = 1; r <= ROUNDS; r++) {
      a = this.rotateLeft(a ^ b, b) + this.rk[2 * r];
      b = this.rotateLeft(b ^ a, a) + this.rk[2 * r + 1];
    }

    return this.packLong(a, b);
  }

  decrypt(input: bigint): bigint {
    let a = Number(input & 0xffffffffn);
    let b = Number((input >> 32n) & 0xffffffffn);

    for (let i = ROUNDS; i > 0; i--) {
      b = this.rotateRight(b - this.rk[2 * i + 1], a) ^ a;
      a = this.rotateRight(a - this.rk[2 * i], b) ^ b;
    }

    b -= this.rk[1];
    a -= this.rk[0];

    return this.packLong(a, b);
  }

  private rotateLeft(x: number, y: number): number {
    const shift = y & 31;
    return ((x << shift) | (x >>> (32 - shift))) | 0;
  }

  private rotateRight(x: number, y: number): number {
    const shift = y & 31;
    return ((x >>> shift) | (x << (32 - shift))) | 0;
  }

  private packLong(a: number, b: number): bigint {
    const aUnsigned = BigInt(a >>> 0);
    const bUnsigned = BigInt(b >>> 0);
    return aUnsigned | (bUnsigned << 32n);
  }
}
