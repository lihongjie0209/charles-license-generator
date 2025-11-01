import { CkCipher } from './cipher.js';

const CK_NAME = 0x7a21c951691cd470n;
const CK_KEY = -5408575981733630035n;

/**
 * Generate a Charles license key for the given name
 */
export function generateLicenseKey(name: string): string {
  const nameBytes = new TextEncoder().encode(name);
  const length = nameBytes.length + 4;
  const padded = length + ((-length) & 7);
  
  // Create buffer with length prefix
  const buffer = new Uint8Array(padded);
  const view = new DataView(buffer.buffer);
  view.setUint32(0, nameBytes.length, false); // Big-endian
  buffer.set(nameBytes, 4);

  // Encrypt the name using cipher
  const ck = new CkCipher(CK_NAME);
  const outBuffer: number[] = [];

  for (let i = 0; i < padded; i += 8) {
    const view = new DataView(buffer.buffer, i, 8);
    const nowVar = view.getBigInt64(0, false); // Big-endian
    
    const encrypted = ck.encrypt(nowVar);
    
    // Write 8 bytes
    for (let j = 7; j >= 0; j--) {
      outBuffer.push(Number((encrypted >> BigInt(j * 8)) & 0xffn));
    }
  }

  // Calculate checksum
  let n = 0;
  for (const b of outBuffer) {
    const signed = b << 24 >> 24; // Convert to signed byte
    n = rotateLeft(n ^ signed, 3);
  }

  const prefix = n ^ 0x54882f8a;
  const suffix = Math.floor(Math.random() * 0x7fffffff);
  
  let input = BigInt(prefix) << 32n;
  const s = BigInt(suffix);
  const suffixHigh = suffix >> 16;

  switch (suffixHigh) {
    case 0x0401:
    case 0x0402:
    case 0x0403:
      input |= s;
      break;
    default:
      input |= 0x01000000n | (s & 0xffffffn);
      break;
  }

  // Decrypt to get final key
  const out = new CkCipher(CK_KEY).decrypt(input);

  // Calculate validation byte
  let n2 = 0n;
  for (let i = 56; i >= 0; i -= 8) {
    n2 ^= (input >> BigInt(i)) & 0xffn;
  }

  let vv = Number(n2 & 0xffn);
  if (vv < 0) {
    vv = -vv;
  }

  return `${vv.toString(16).padStart(2, '0')}${(out & 0xffffffffffffffffn).toString(16).padStart(16, '0')}`;
}

/**
 * Verify a Charles license key for the given name
 */
export function verifyLicenseKey(name: string, key: string): boolean {
  try {
    if (key.length !== 18) {
      return false;
    }

    // Parse the key - format is: checksum(2) + decrypted_value(16)
    const checkByte = parseInt(key.substring(0, 2), 16);
    const keyHigh = BigInt('0x' + key.substring(2, 10));
    const keyLow = BigInt('0x' + key.substring(10, 18));
    const out = (keyHigh << 32n) | keyLow;

    // Encrypt 'out' to get back 'in' (the original prefix+suffix)
    const cipher = new CkCipher(CK_KEY);
    const inputValue = cipher.encrypt(out);

    // Verify checksum - computed on 'in', not 'out'
    let n2 = 0n;
    for (let i = 56; i >= 0; i -= 8) {
      n2 ^= (inputValue >> BigInt(i)) & 0xffn;
    }
    const calculatedCheck = Math.abs(Number(n2 & 0xffn));
    
    if (calculatedCheck !== checkByte) {
      return false;
    }

    // Extract prefix from input value (upper 32 bits)
    const prefix = Number((inputValue >> 32n) & 0xffffffffn);
    
    // Encode name and calculate expected prefix
    const nameBytes = new TextEncoder().encode(name);
    const length = nameBytes.length + 4;
    const padded = length + ((-length) & 7);
    
    const buffer = new Uint8Array(padded);
    const view = new DataView(buffer.buffer);
    view.setUint32(0, nameBytes.length, false);
    buffer.set(nameBytes, 4);

    const ck = new CkCipher(CK_NAME);
    const outBuffer: number[] = [];

    for (let i = 0; i < padded; i += 8) {
      const view = new DataView(buffer.buffer, i, 8);
      const nowVar = view.getBigInt64(0, false);
      const encrypted = ck.encrypt(nowVar);
      
      for (let j = 7; j >= 0; j--) {
        outBuffer.push(Number((encrypted >> BigInt(j * 8)) & 0xffn));
      }
    }

    let n = 0;
    for (const b of outBuffer) {
      const signed = b << 24 >> 24;
      n = rotateLeft(n ^ signed, 3);
    }

    const expectedPrefix = (n ^ 0x54882f8a) >>> 0; // Convert to unsigned 32-bit
    
    // Compare as unsigned 32-bit integers
    const prefixUnsigned = (prefix >>> 0);
    return prefixUnsigned === expectedPrefix;
  } catch (error) {
    return false;
  }
}

function rotateLeft(x: number, y: number): number {
  const shift = y & 31;
  return ((x << shift) | (x >>> (32 - shift))) | 0;
}
