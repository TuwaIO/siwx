import { describe, expect, it } from 'vitest';

import { base64UrlToBytes, base64UrlToUtf8, bytesToBase64Url, utf8ToBase64Url } from './encoding';

describe('base64url encoding', () => {
  it('encodes bytes without padding and with the URL-safe alphabet', () => {
    expect(bytesToBase64Url(new Uint8Array([0xfb, 0xff, 0xbf]))).toBe('-_-_');
    expect(bytesToBase64Url(new Uint8Array([1]))).toBe('AQ');
  });

  it('decodes what it encodes', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 251, 252, 253, 254, 255]);
    expect(Array.from(base64UrlToBytes(bytesToBase64Url(bytes)))).toEqual(Array.from(bytes));
  });

  it('round-trips UTF-8 text, including characters outside Latin-1', () => {
    const text = '{"name":"Олександр ✓"}';
    expect(base64UrlToUtf8(utf8ToBase64Url(text))).toBe(text);
  });

  it('encodes ASCII text exactly like btoa with the URL-safe alphabet', () => {
    const text = '{"v":2,"address":"eip155:1:0xabc"}';
    expect(utf8ToBase64Url(text)).toBe(btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
  });
});
