import { test } from 'node:test';
import assert from 'node:assert';
import { generateLicenseKey, verifyLicenseKey } from './license.js';

test('generateLicenseKey should generate a valid 18-character key', () => {
  const name = 'charles';
  const key = generateLicenseKey(name);
  
  assert.strictEqual(key.length, 18, 'Key should be 18 characters long');
  assert.match(key, /^[0-9a-f]{18}$/, 'Key should be hexadecimal');
});

test('verifyLicenseKey should verify a valid key-name pair', () => {
  const name = 'charles';
  const key = generateLicenseKey(name);
  
  assert.strictEqual(verifyLicenseKey(name, key), true, 'Generated key should be valid');
});

test('verifyLicenseKey should reject invalid key', () => {
  const name = 'charles';
  const invalidKey = '000000000000000000';
  
  assert.strictEqual(verifyLicenseKey(name, invalidKey), false, 'Invalid key should be rejected');
});

test('verifyLicenseKey should reject key for different name', () => {
  const name1 = 'charles';
  const name2 = 'different';
  const key1 = generateLicenseKey(name1);
  
  assert.strictEqual(verifyLicenseKey(name2, key1), false, 'Key should not work for different name');
});

test('generateLicenseKey should work with different names', () => {
  const testNames = ['alice', 'bob', 'charlie', 'david', 'eve'];
  
  for (const name of testNames) {
    const key = generateLicenseKey(name);
    assert.strictEqual(key.length, 18, `Key for ${name} should be 18 characters`);
    assert.strictEqual(verifyLicenseKey(name, key), true, `Key for ${name} should be valid`);
  }
});

test('generateLicenseKey should work with unicode names', () => {
  const testNames = ['张三', 'Владимир', 'José'];
  
  for (const name of testNames) {
    const key = generateLicenseKey(name);
    assert.strictEqual(key.length, 18, `Key for ${name} should be 18 characters`);
    assert.strictEqual(verifyLicenseKey(name, key), true, `Key for ${name} should be valid`);
  }
});

test('verifyLicenseKey should reject malformed keys', () => {
  const name = 'test';
  
  assert.strictEqual(verifyLicenseKey(name, ''), false, 'Empty key should be rejected');
  assert.strictEqual(verifyLicenseKey(name, '123'), false, 'Short key should be rejected');
  assert.strictEqual(verifyLicenseKey(name, '12345678901234567890'), false, 'Long key should be rejected');
  assert.strictEqual(verifyLicenseKey(name, 'gggggggggggggggggg'), false, 'Invalid hex should be rejected');
});

test('multiple key generations for same name should all be valid', () => {
  const name = 'testuser';
  const keys = new Set<string>();
  
  // Generate 10 keys for the same name
  for (let i = 0; i < 10; i++) {
    const key = generateLicenseKey(name);
    keys.add(key);
    assert.strictEqual(verifyLicenseKey(name, key), true, `Key ${i + 1} should be valid`);
  }
  
  // Keys should be different due to random suffix
  assert.ok(keys.size > 1, 'Multiple generations should produce different keys');
});

test('empty name should generate and verify correctly', () => {
  const name = '';
  const key = generateLicenseKey(name);
  
  assert.strictEqual(key.length, 18, 'Key for empty name should be 18 characters');
  assert.strictEqual(verifyLicenseKey(name, key), true, 'Key for empty name should be valid');
});

test('long name should generate and verify correctly', () => {
  const name = 'a'.repeat(100);
  const key = generateLicenseKey(name);
  
  assert.strictEqual(key.length, 18, 'Key for long name should be 18 characters');
  assert.strictEqual(verifyLicenseKey(name, key), true, 'Key for long name should be valid');
});
